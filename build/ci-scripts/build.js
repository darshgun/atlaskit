#! /usr/bin/env node
/**
 * The canonical build script for Atlaskit.
 * See CONTRIBUTING.md#building-packages for more information.
 */
const bolt = require('bolt');
const concurrently = require('concurrently');
const meow = require('meow');

const { getPackagesInfo } = require('@atlaskit/build-utils/tools');
const getGlobPackagesForTools = require('./get.glob.packages.for.tools');
const createEntryPointsDirectories = require('./create.entry.points.directories');
const copyVersion = require('./copy.version');

async function runCommands(commands, opts = {}) {
  const defaultOpts = {
    // Will kill other processes when one fails
    killOthers: ['failure'],
    // Opt out of default logging prefix of index/name - bolt does most of this for us already
    prefix: 'none',
    // Raw mode will strictly output only raw output, rather than extra stuff
    // that concurrently outputs. We enable the extra output for now.
    raw: false,
  };
  if (commands.length === 0) {
    return;
  }
  if (commands.length === 1 || !opts.sequential) {
    return concurrently(commands, { ...defaultOpts, ...opts }).catch(e => {
      // Hide internal concurrently stack trace
      throw Error('Command failed');
    });
  } else {
    let result;
    for (const command of commands) {
      result = await runCommands([command]);
    }
    return result;
  }
}

async function getPkgGlob(tools, pkg, { cwd }) {
  return pkg ? pkg.relativeDir : await getGlobPackagesForTools(tools, { cwd });
}

async function generateFlowTypeCommands({ cwd, pkg, watch }) {
  if (pkg && !(pkg.isBabel && pkg.isFlow)) {
    return [];
  }
  const pkgGlob = await getPkgGlob(['babel', 'flow'], pkg, { cwd });
  const watchFlag = watch ? ' -w' : '';
  return [
    `bolt workspaces exec --only-fs "${pkgGlob}" -- flow-copy-source -i '**/__tests__/**' src dist/cjs${watchFlag}`,
    `bolt workspaces exec --only-fs "${pkgGlob}" -- flow-copy-source -i '**/__tests__/**' src dist/esm${watchFlag}`,
  ];
}

async function babelCommands({ cwd, pkg, watch }) {
  if (pkg && !pkg.isBabel) {
    return [];
  }
  const pkgGlob = await getPkgGlob(['babel'], pkg, { cwd });
  // Watch mode does not output anything on recompile, so we have to use verbose to signal something has happened
  // https://github.com/babel/babel/issues/7926
  const watchFlag = watch ? ' -w --verbose' : '';
  return [
    `NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "${pkgGlob}" -- babel src -d dist/cjs --root-mode upward${watchFlag}`,
    `NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "${pkgGlob}" -- babel src -d dist/esm --root-mode upward${watchFlag}`,
  ];
}

async function buildJSPackages({ cwd, pkg, watch }) {
  return runCommands([
    ...(await babelCommands({ cwd, pkg, watch })),
    ...(await generateFlowTypeCommands({ cwd, pkg, watch })),
  ]);
}

async function cliTsCommands({ cwd, pkg, watch }) {
  if (pkg && !pkg.isTypeScriptCLI) {
    return [];
  }

  const pkgGlob = await getPkgGlob(['typescriptcli'], pkg, { cwd });
  const watchFlag = watch ? ' -w --preserveWatchOutput' : '';
  return [
    `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/cli${watchFlag} || true'`,
  ];
}

async function standardTsCommands({ cwd, pkg, watch }) {
  if (pkg && !pkg.isTypeScript) {
    return [];
  }

  const pkgGlob = await getPkgGlob(['typescript'], pkg, { cwd });
  // preserveWatchOutput prevents watch from clearing console output on every change
  const watchFlag = watch ? ' -w --preserveWatchOutput' : '';
  // The `|| true` at the end of each typescript command was knowingly added in https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/5722/update-tsconfig/diff
  // to suppress multi-entry point related failures, relying on the separate `typecheck` command to catch typecheck errors. Unfortunately, this also
  // suppresses legitimate errors caused by things like dependencies not being built before dependents and means we create inaccurate index.d.ts files.
  // We want to fix this by changing the way we do multi entry points, using typescript project references or another way as error suppression is not a good idea.
  return [
    `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs${watchFlag} || true'`,
    `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext${watchFlag} || true'`,
  ];
}

/**
 * Builds typescript packages.
 *
 * Typescript packages in a monorepo need to be built in a topological order, meaning dependencies need to be built before their dependents. Otherwise
 * any dependency types used are treated as `any`.
 * We are leveraging `bolt workspaces exec`'s default topological execution order to achieve this, however there are some existing issues with this:
 *  - The topological order factors in devDependencies when they are not required for building source -https://github.com/boltpkg/bolt/pull/244
 *  - At least one circular dependency exists between packages in the repo, which makes a pure topological sort impossible
 */
async function buildTSPackages({ cwd, pkg, watch }) {
  return runCommands(
    [
      ...(await standardTsCommands({ cwd, pkg, watch })),
      ...(await cliTsCommands({ cwd, pkg, watch })),
    ],
    // When building all packages we run the ts commands sequentially  as the `types` field in package.json
    // references the main index.d.ts in the cjs directory. Resulting in cjs needing to be built before esm/cli
    // so that packages can properly utilise the types of their atlaskit dependencies.
    // When building a package individually, we no longer have this requirement as we are only building a single package.
    { sequential: !pkg },
  );
}

async function buildExceptionPackages({ cwd, pkg }) {
  await bolt.workspacesRun({
    cwd,
    filterOpts: {
      only: pkg && pkg.name,
    },
    spawnOpts: {
      parallel: true,
    },
    script: 'ak-postbuild',
  });
}

async function getPkgInfo(packageName) {
  const allPkgs = await getPackagesInfo(packageName, {
    only: packageName,
  });
  if (allPkgs.length === 0) {
    throw Error(`Cannot find package "${packageName}" in workspaces`);
  }
  if (allPkgs.length > 1) {
    throw Error(`Matched multiple packages, provide an exact package name`);
  }
  return allPkgs[0];
}

async function main(packageName, opts = {}) {
  const { buildIsClean, cwd, watch } = opts;
  if (!packageName && watch) {
    throw 'Watch mode is only supported for single package builds only.';
  }
  if (watch) {
    // Do a full build first to ensure non-compilation build steps have built since they are not rerun
    // in watch mode
    console.log(
      'Running initial build for watch mode to cover non-compilation build steps...',
    );
    await main(packageName, { ...opts, watch: false });
  }

  console.log(`Building ${packageName ? packageName : 'all packages'}...`);
  let pkg;
  if (packageName) {
    pkg = await getPkgInfo(packageName);
  }
  console.log('Creating entry point directories...');
  await createEntryPointsDirectories({ buildIsClean, cwd, packageName });
  console.log('Building JS packages...');
  await buildJSPackages({ cwd, pkg, watch });
  console.log('Building TS packages...');
  await buildTSPackages({ cwd, pkg, watch });
  console.log('Running post-build scripts for packages...');
  await buildExceptionPackages({ cwd, pkg, watch });
  console.log('Copying version.json...');
  await copyVersion(packageName);
  console.log('Success');
}

if (require.main === module) {
  process.on('SIGINT', () => {
    // We need our own SIGINT handler since concurrently overrides the default one (and doesn't even throw)
    process.exit(2);
  });
  const cli = meow(
    `
      Usage
        $ bolt build [packageName]

      Options
        --build-is-clean      Tells the build that the working directory is clean and errors when entry point folders clash with src
        --watch               Run the build in watch mode. Note this only reruns the compilation step (tsc/babel) and only works with a single package

      Examples
        $ bolt build @atlaskit/button --watch
  `,
    {
      description:
        'Builds [packageName] or all packages if no package name provided',
      flags: {
        buildIsClean: {
          type: 'boolean',
        },
        watch: {
          alias: 'w',
          type: 'boolean',
        },
      },
    },
  );

  main(cli.input[0], {
    cwd: process.cwd(),
    ...cli.flags,
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = main;
