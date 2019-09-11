#! /usr/bin/env node
/**
 * The canonical build script for Atlaskit
 */
const bolt = require('bolt');
const concurrently = require('concurrently');

const createEntryPointsDirectories = require('./create.entry.points.directories');
const copyVersion = require('./copy.version');
const checkDists = require('../utils/sanity-check-file-structure-dist');

async function runCommands(commands, opts = {}) {
  const defaultOpts = {
    killOthers: ['failure'],
    prefix: 'none',
    raw: false,
  };
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

function generateFlowTypeCommands() {
  return [
    `bolt workspaces exec --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js babel flow)\" -- flow-copy-source -v -i '**/__tests__/**' src dist/cjs`,
    `bolt workspaces exec --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js babel flow)\" -- flow-copy-source -v -i '**/__tests__/**' src dist/esm`,
  ];
}

function babelCommands() {
  return [
    `NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js babel)\" -- babel src -d dist/cjs --root-mode upward`,
    `NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js babel)\" -- babel src -d dist/esm --root-mode upward`,
  ];
}

function buildJSPackages() {
  return runCommands([...babelCommands(), ...generateFlowTypeCommands()]);
}

function buildTSPackages() {
  // TODO: Can cli + esm be parallelised?
  return runCommands(
    [
      `NODE_ENV=production bolt workspaces exec --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js typescript)\" -- bash -c 'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs || true'`,
      `NODE_ENV=production bolt workspaces exec --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js typescript)\" -- bash -c 'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext || true'`,
      `NODE_ENV=production bolt workspaces exec --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js typescriptcli)\" -- bash -c 'tsc --project ./build/cli || true'`,
    ],
    { sequential: true },
  );
}

async function buildExceptionPackages() {
  await bolt.workspacesRun({
    filterOpts: {},
    spawnOpts: {
      parallel: true,
    },
    script: 'ak-postbuild',
  });
}

async function main() {
  const cwd = process.cwd();
  // Concerns: Most errors are caught and only handled via a console.log/error
  // TODO: Need to run some clean script to get rid of build artifacts
  //       current delete:build:artefacts blows too much away
  console.log('Creating entry point directories...');
  await createEntryPointsDirectories();
  // TODO: Fix up icon package builds that reimplement their own babel cjs
  // TODO: Can JS + TS be parallelised?
  console.log('Building JS packages...');
  await buildJSPackages();
  // TODO: Fix up icon package builds that reimplement their own typescript cjs
  console.log('Building TS packages...');
  await buildTSPackages();
  console.log('Running post-build scripts for packages...');
  await buildExceptionPackages();
  console.log('Copying version.json...');
  await copyVersion();
  console.log('Checking dists...');
  await checkDists({ cwd });
  console.log('Success');
}

if (require.main === module) {
  process.on('SIGINT', () => {
    // We need our own SIGINT handler since concurrently overrides the default one (and doesn't even throw)
    process.exit(2);
  });
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = main;
