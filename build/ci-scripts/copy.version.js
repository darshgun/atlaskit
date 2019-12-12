#! /usr/bin/env node
// @flow
/**
 * Copy package.json version information to a specific location in dist
 */

const bolt = require('bolt');
const copyPkg = require('copy-pkg');
const fse = require('fs-extra');

async function copyVersionJson(pkg) {
  const { dir } = pkg;
  const distDir = `${dir}/dist`;
  await copyPkg(`${dir}/package.json`, `${dir}/dist`, {
    only: ['name', 'version', 'sideEffects'],
  });
  for (const distType of ['cjs', 'esm']) {
    await fse.mkdirp(`${distDir}/${distType}`);
    await fse.copy(
      `${distDir}/package.json`,
      `${distDir}/${distType}/version.json`,
    );
  }
  await fse.remove(`${distDir}/package.json`);
}

async function main(pkgName /*: ?string */) {
  // We always use `onlyFs` to restrict execution to the packages dir regardless of whether packageName is present
  const filterOpts = { only: pkgName || undefined, onlyFs: 'packages/*/*' };
  await bolt.runWorkspaceTasks(pkg => copyVersionJson(pkg), {
    filterOpts,
  });
}

if (require.main === module) {
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = main;
