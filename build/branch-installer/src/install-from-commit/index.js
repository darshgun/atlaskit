// @flow
const fetch = require('node-fetch');
const chalk = require('chalk');
const spawndamnit = require('spawndamnit');
const prettyjson = require('prettyjson');
const pWaitFor = require('p-wait-for');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const retry = require('async-retry');

const CDN_URL_BASE =
  'https://s3-ap-southeast-2.amazonaws.com/atlaskit-artefacts';

function flattenDeep(arr1) {
  return arr1.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    [],
  );
}

async function getInstalledAtlaskitDependencies() {
  let packageJSON;

  try {
    packageJSON = JSON.parse(
      (await readFile('./package.json', 'utf8')).toString(),
    );
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }

  const atlaskitDependencies = flattenDeep(
    [
      'dependencies',
      'devDependencies',
      'bundledDependencies',
      'optionalDependencies',
      'peerDependencies',
    ]
      .filter(depType => typeof packageJSON[depType] === 'object')
      .map(depType => {
        return Object.entries(packageJSON[depType])
          .filter(([name]) => name.startsWith('@atlaskit'))
          .map(([name]) => name);
      }),
  );

  return atlaskitDependencies.filter(
    (item, i) => atlaskitDependencies.indexOf(item) === i,
  );
}
// This function needs to be shared between the cli and the main node entry point
// so that they can print different error messages
function validateOptions(commitHash /*:string */, options /*: Object */ = {}) {
  const errors = [];
  const { engine, cmd, timeout, interval } = options;

  if (!commitHash || commitHash.length < 12) {
    errors.push('Commit hash is required and must be at least 12 characters');
  }
  if (!['yarn', 'bolt'].includes(engine)) {
    errors.push('engine must be one of [yarn, bolt]');
  }
  if (!['add', 'upgrade'].includes(cmd)) {
    errors.push('cmd must be one of [add, upgrade]');
  }
  if (timeout < 1) {
    errors.push('timeout must be more than 1ms');
  }
  if (interval < 1) {
    errors.push('interval be more than 1ms');
  }

  return errors;
}

// returns a function used for logging or doing nothing (depending on shouldLog)
// i.e const logAlways = createLogger(true);
// const logInDebugMode = createLogger(flags.debug);

// eslint-disable-next-line no-unused-vars
const createLogger = shouldLog => {
  if (shouldLog) {
    return message => {
      if (typeof message === 'string') {
        console.log(chalk.cyan(message));
      } else {
        console.log(prettyjson.render(message));
      }
    };
  }

  return () => {};
};

async function getManifestForCommit(commitHash, options /*: Object */ = {}) {
  const manifestUrl = `${CDN_URL_BASE}/${commitHash}/dists/manifest.json`;
  const { log } = options;
  const { interval, timeout } = options;

  log(`Fetching manifest from ${manifestUrl}`);

  await pWaitFor(() => urlExists(manifestUrl, options), { interval, timeout });
  const manifest = await fetchVerbose(manifestUrl, options);

  return manifest;
}

const urlExists = async (url, options /*: Object */ = {}) => {
  const { verboseLog } = options;

  verboseLog(`Checking if url exists: ${url}`);

  const response = await fetch(url, { method: 'HEAD' });
  verboseLog(`HTTP Code ${response.status}`);

  return response.status === 200;
};

const fetchVerbose = async (url, options /*: Object */ = {}) => {
  const { verboseLog } = options;
  verboseLog(`Trying to fetch ${url}`);

  const response = await fetch(url);
  verboseLog(`HTTP Code ${response.status}`);
  const result = await response.json();
  verboseLog(result);

  return result;
};

/**
 * Might look weird to have this extra wrapping function, but its so that when requiring from
 * node we can throw an error that can be caught, and from the cli we can print them and correctly
 * process.exit
 */
async function installFromCommit(
  fullCommitHash /*: string */ = '',
  userOptions /*: Object */ = {},
) {
  const defaultOptions = {
    dryRun: false,
    verbose: false,
    engine: 'yarn',
    cmd: 'add',
    packages: 'all',
    timeout: 20000,
    interval: 5000,
    extraArgs: [],
  };
  const options = {
    ...defaultOptions,
    ...userOptions,
  };
  const commitHash = fullCommitHash.substr(0, 12);
  const errors = validateOptions(commitHash, options);

  if (errors.length !== 0) {
    throw new Error(errors.join('\n'));
  }

  return _installFromCommit(commitHash, options);
}

async function _installFromCommit(
  commitHash /*: string */ = '',
  options /*: Object */ = {},
) {
  const { log } = options;
  const { verboseLog } = options;

  verboseLog('Running with options:');
  verboseLog({ ...options, commitHash });

  const manifest = await getManifestForCommit(commitHash, {
    ...options,
    log,
    verboseLog,
  });
  const packages =
    options.packages === 'all'
      ? await getInstalledAtlaskitDependencies()
      : options.packages.split(',');

  const packagesToInstall = packages.filter(pkg => manifest[pkg]);
  if (packagesToInstall.length === 0) {
    log('No packages to install.');
    return;
  }

  const { engine, cmd } = options;
  const cmdArgs = [cmd, ...options.extraArgs]; // args that we'll pass to the engine ('add'/'upgrade' pkgName@url pkgName@url)

  packagesToInstall.forEach(pkg => {
    log(`Notice: Installing branch-deploy for: ${pkg}`);
    const tarUrl = `${CDN_URL_BASE}/${commitHash}/dists/${manifest[pkg].tarFile}`;
    cmdArgs.push(`${pkg}@${tarUrl}`);
  });

  if (options.dryRun) {
    log('[Dry run] would have run command:');
    log(`$ ${engine} ${cmdArgs.join(' ')}`);
  } else {
    log('Running command:');
    log(`$ ${engine} ${cmdArgs.join(' ')}`);

    let retryCount = 0;
    /*
    On CI we get a weird concurrency issue when installing transitive dependencies from the Atlaskit
    branch deploy. Re-running the upgrade fixes that problem. It's not great but it unblocks Confluence.
    https://github.com/yarnpkg/yarn/issues/2629
     */
    await retry(
      async () => {
        try {
          await spawndamnit(engine, cmdArgs, {
            stdio: 'inherit',
            // $FlowFixMe - isTTY is not in $Stream
            shell: process.stdout.isTTY,
          });
        } catch (err) {
          log(`${retryCount} retry at running command failed`);
          log(err.toString());
          retryCount++;
          throw err;
        }

        return true;
      },
      {
        retries: 3,
      },
    );
  }
}

module.exports = {
  installFromCommit,
  _installFromCommit,
  validateOptions,
};
