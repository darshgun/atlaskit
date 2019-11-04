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
  if (packageInfo.isTypeScriptCLI) {
    await fse.move(`${distDir}/package.json`, `${distDir}/version.json`, {
      overwrite: true,
    });
  } else {
    await fse.mkdirp(`${distDir}/cjs`);
    await fse.mkdirp(`${distDir}/esm`);
    await fse.move(`${distDir}/package.json`, `${distDir}/cjs/version.json`, {
      overwrite: true,
    });
    await fse.copy(
      `${distDir}/cjs/version.json`,
      `${distDir}/esm/version.json`,
    );
  }
}

async function main(
  pkgName? /*: string */,
  { cwd /*: string */ } /* Object */ = {},
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
