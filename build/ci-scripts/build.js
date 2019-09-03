#! /usr/bin/env node
/**
 * The canonical build script for Atlaskit
 */

const createEntryPointsDirectories = require('./create.entry.points.directories');

// Concerns: Most errors are caught and only handled via a console.log/error
// TODO: Need to run some clean script to get rid of build artifacts
//       current delete:build:artefacts blows too much away
// yarn build:create:folder:entry-points
createEntryPointsDirectories();

// run-p
// build:babel
// run-p
// build:babel:cjs
// SHELL: NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js babel)\" -- babel src -d dist/cjs --root-mode upward
// build:babel:esm
// SHELL: NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js babel)\" -- babel src -d dist/esm --root-mode upward

// build:flowtypes
// run-p
// build:flowtypes:cjs
// SHELL: bolt workspaces exec --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js babel flow)\" -- flow-copy-source -v -i '**/__tests__/**' src dist/cjs
// build:flowtypes:esm
// SHELL: bolt workspaces exec --only-fs \"$(node ./build/ci-scripts/get.glob.packages.for.tools.js babel flow)\" -- flow-copy-source -v -i '**/__tests__/**' src dist/esm

// run-p --print-label --continue-on-error
// build:typescript
// run-serial (&&)
// yarn build:typescript:cjs
// yarn build:typescript:esm
// yarn build:typescript:cli
// build:adf-schema:json-schema (Convert to package pre/postbuild script?)
// SHELL: cd packages/editor/adf-schema && yarn run build:json-schema && echo 'Done.'
// yarn build:exception-packages
// yarn build:media-editor:copy-binaries && yarn build:css-reset && yarn build:reduced-ui-pack && yarn build:email-renderer && yarn build:util-data-test
// yarn copy:version (killme)
//  bolt workspaces exec --ignore-fs '{packages/editor/updater-cli,packages/monorepo-tooling/code-insights,packages/monorepo-tooling/dependency-version-analytics,packages/monorepo-tooling/branch-deploy-product-integrator}' --only-fs 'packages/*/*' -- mkdir -p dist/{cjs,esm} && bolt workspaces exec  --only-fs 'packages/*/*' -- copy-pkg package.json tmp/package.json --only name,version,sideEffects && bolt workspaces exec --ignore-fs '{packages/editor/updater-cli,packages/monorepo-tooling/code-insights,packages/monorepo-tooling/dependency-version-analytics,packages/monorepo-tooling/branch-deploy-product-integrator}' --only-fs 'packages/*/*' -- cp ./tmp/package.json ./dist/cjs/version.json && bolt workspaces exec --ignore-fs '{packages/editor/updater-cli,packages/monorepo-tooling/code-insights,packages/monorepo-tooling/dependency-version-analytics,packages/monorepo-tooling/branch-deploy-product-integrator}' --only-fs 'packages/*/*' -- cp ./tmp/package.json ./dist/esm/version.json && bolt workspaces exec --only-fs '{packages/editor/updater-cli,packages/monorepo-tooling/code-insights,packages/monorepo-tooling/dependency-version-analytics,packages/monorepo-tooling/branch-deploy-product-integrator}' -- cp ./tmp/package.json ./dist/version.json
// yarn check:dists
// SHELL: node ./build/utils/sanity-check-file-structure-dist.js && yarn check:typescript-dists
