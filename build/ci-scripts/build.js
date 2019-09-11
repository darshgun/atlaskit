#! /usr/bin/env node
/**
 * The canonical build script for Atlaskit
 */
const bolt = require('bolt');
const concurrently = require('concurrently');

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

async function generateFlowTypeCommands({ cwd, pkg }) {
  if (pkg && !(pkg.isBabel && pkg.isFlow)) {
    return [];
  }
  const pkgGlob = pkg
    ? pkg.relativeDir
    : await getGlobPackagesForTools(['babel', 'flow'], { cwd });
  return [
    `bolt workspaces exec --only-fs "${pkgGlob}" -- flow-copy-source -v -i '**/__tests__/**' src dist/cjs`,
    `bolt workspaces exec --only-fs "${pkgGlob}" -- flow-copy-source -v -i '**/__tests__/**' src dist/esm`,
  ];
}

async function babelCommands({ cwd, pkg }) {
  if (pkg && !pkg.isBabel) {
    return [];
  }
  const pkgGlob = pkg
    ? pkg.relativeDir
    : await getGlobPackagesForTools(['babel'], { cwd });
  return [
    `NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "${pkgGlob}" -- babel src -d dist/cjs --root-mode upward`,
    `NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "${pkgGlob}" -- babel src -d dist/esm --root-mode upward`,
  ];
}

async function buildJSPackages({ cwd, pkg }) {
  return runCommands([
    ...(await babelCommands({ cwd, pkg })),
    ...(await generateFlowTypeCommands({ cwd, pkg })),
  ]);
}

async function cliTsCommands({ cwd, pkg }) {
  if (pkg && !pkg.isTypeScriptCLI) {
    return [];
  }
  const pkgGlob = pkg
    ? pkg.relativeDir
    : await getGlobPackagesForTools(['typescriptcli'], { cwd });

  return [
    `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/cli || true'`,
  ];
}

async function standardTsCommands({ cwd, pkg }) {
  if (pkg && !pkg.isTypeScript) {
    return [];
  }
  const pkgGlob = pkg
    ? pkg.relativeDir
    : await getGlobPackagesForTools(['typescript'], { cwd });

  return [
    `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs || true'`,
    `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext || true'`,
  ];
}

async function buildTSPackages({ cwd, pkg }) {
  // TODO: Can cli + esm be parallelised?
  return runCommands(
    [
      ...(await standardTsCommands({ cwd, pkg })),
      ...(await cliTsCommands({ cwd, pkg })),
    ],
    { sequential: true },
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

async function main({ cwd, packageName }) {
  console.log(`Building ${packageName ? packageName : 'all packages'}...`);
  let pkg;
  if (packageName) {
    pkg = await getPkgInfo(packageName);
  }
  // Concerns: Most errors are caught and only handled via a console.log/error
  // TODO: Need to run some clean script to get rid of build artifacts
  //       current delete:build:artefacts blows too much away
  //       Or we could make this idempotent by not erroring on existing entry points by default and adding a flag
  //       that CI runs to perform the check
  console.log('Creating entry point directories...');
  await createEntryPointsDirectories({ cwd, packageName });
  // TODO: Fix up icon package builds that reimplement their own babel cjs
  // TODO: Can JS + TS be parallelised?
  console.log('Building JS packages...');
  await buildJSPackages({ cwd, pkg });
  // // TODO: Fix up icon package builds that reimplement their own typescript cjs
  console.log('Building TS packages...');
  await buildTSPackages({ cwd, pkg });
  console.log('Running post-build scripts for packages...');
  await buildExceptionPackages({ cwd, pkg });
  console.log('Copying version.json...');
  await copyVersion(packageName);
  console.log('Success');
}

if (require.main === module) {
  process.on('SIGINT', () => {
    // We need our own SIGINT handler since concurrently overrides the default one (and doesn't even throw)
    process.exit(2);
  });
  const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
  // const flags = process.argv.slice(2).filter(a => a.startsWith('--'));
  const packageName = args[0] || undefined;
  main({
    cwd: process.cwd(),
    packageName,
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = main;
