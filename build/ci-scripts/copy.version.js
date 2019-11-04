#! /usr/bin/env node
// @flow
/**
 * Copy package.json version information to a specific location in dist
 */

const bolt = require('bolt');
const copyPkg = require('copy-pkg');
const fse = require('fs-extra');
const { getPackageInfo } = require('@atlaskit/build-utils/tools');

async function copyVersionJson(pkg, project) {
  const { dir } = pkg;
  const distDir = `${dir}/dist`;
  await copyPkg(`${dir}/package.json`, `${dir}/dist`, {
    only: ['name', 'version', 'sideEffects'],
  });
  const packageInfo = await getPackageInfo(pkg, project);
  if (packageInfo.runTypeScriptCjs) {
    await fse.mkdirp(`${distDir}/cjs`);
    await fse.copy(`${distDir}/package.json`, `${distDir}/cjs/version.json`);
  }
  if (packageInfo.runTypescriptEsm) {
    await fse.mkdirp(`${distDir}/esm`);
    await fse.copy(`${distDir}/package.json`, `${distDir}/esm/version.json`);
  }
  await fse.remove(`${distDir}/package.json`);
}

async function main(
  pkgName /*: ?string */,
  { cwd } /*: { cwd: string } */ = {},
) {
  const project = await bolt.getProject({ cwd });
  // We always use `onlyFs` to restrict execution to the packages dir regardless of whether packageName is present
  const filterOpts = { only: pkgName || undefined, onlyFs: 'packages/*/*' };
  await bolt.runWorkspaceTasks(pkg => copyVersionJson(pkg, project), {
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
