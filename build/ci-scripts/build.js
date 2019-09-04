#! /usr/bin/env node
/**
 * The canonical build script for Atlaskit
 */
const bolt = require('bolt');
const concurrently = require('concurrently');

const createEntryPointsDirectories = require('./create.entry.points.directories');
const copyVersion = require('./copy.version');

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

function buildExceptionPackages() {
  // TODO: Refactor this to be per-package pre/post builds
  return runCommands([
    `yarn build:adf-schema:json-schema && yarn build:media-editor:copy-binaries && yarn build:css-reset && yarn build:reduced-ui-pack && yarn build:email-renderer && yarn build:util-data-test`,
  ]);
}

async function main() {
  // Concerns: Most errors are caught and only handled via a console.log/error
  // TODO: Need to run some clean script to get rid of build artifacts
  //       current delete:build:artefacts blows too much away
  await createEntryPointsDirectories();
  // TODO: Fix up icon package builds that reimplement their own babel cjs
  // TODO: Can JS + TS be parallelised?
  await buildJSPackages();
  // TODO: Fix up icon package builds that reimplement their own typescript cjs
  await buildTSPackages();
  // NOTE: We are knowingly moving adf-schema build to exception packages, doesn't seem to be a reason why it should be run in parallel with '--continue-on-error'
  await buildExceptionPackages();
  await copyVersion();
  // yarn check:dists
  // // SHELL: node ./build/utils/sanity-check-file-structure-dist.js && yarn check:typescript-dists
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
