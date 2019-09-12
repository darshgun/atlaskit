/*
In the past, we had several issues related to building and shipping correctly the dist folder in our packages.
This script will check for each package after having been buit, if it has a dist folder with esm, cjs and for both a version.json.
*/
const fse = require('fs-extra');
const path = require('path');
const { getPackagesInfo } = require('./tools');

const exceptions = [
  '@atlaskit/updater-cli',
  '@atlaskit/dependency-version-analytics',
  '@atlaskit/code-insights',
  '@atlaskit/branch-deploy-product-integrator',
];

const checkForDirEmpty = async folderName => {
  let hasFolder = false;
  try {
    const content = await fse.readdir(folderName);
    if (content.length > 0) hasFolder = true;
  } catch (err) {
    console.error(err);
  }
  return hasFolder;
};

const checkForFile = async fileName => {
  let hasFile = false;
  try {
    hasFile = await fse.exists(fileName);
  } catch (err) {
    console.error(err);
  }
  return hasFile;
};

const getPackageDistInfo = async packages => {
  return Promise.all(
    packages.map(async pkg => {
      const [
        hasEsm,
        hasCjs,
        hasVersionInEsm,
        hasVersionInCjs,
      ] = await Promise.all([
        checkForDirEmpty(`${pkg.dir}/dist/esm`),
        checkForDirEmpty(`${pkg.dir}/dist/cjs`),
        checkForFile(`${pkg.dir}/dist/esm/version.json`),
        checkForFile(`${pkg.dir}/dist/cjs/version.json`),
      ]);
      return {
        pkgName: pkg.name,
        hasEsm,
        hasCjs,
        hasVersionInEsm,
        hasVersionInCjs,
      };
    }),
  );
};

async function main(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const packagesInfo = await getPackagesInfo(cwd);
  const packageDistInfo = await getPackageDistInfo(
    packagesInfo.filter(
      pkg => pkg.dir.includes('/packages') && !exceptions.includes(pkg.name),
    ),
  );
  const invalidPackageDists = packageDistInfo.filter(
    pkg =>
      !pkg.hasCjs && !pkg.hasEsm && !pkg.hasCjsVersion && !pkg.hasEsmVersion,
  );
  return {
    success: invalidPackageDists.length === 0,
    invalidPackageDists,
  };
}

if (require.main === module) {
  main()
    .then(({ success, invalidPackageDists }) => {
      if (!success) {
        console.error(
          `Those packages have issues with their dist folders or version.json: ${JSON.stringify(
            invalidPackageDists,
          )}`,
        );
        process.exit(1);
      }
    })
    .catch(e => {
      console.error(e);
      process.exit(2);
    });
}

module.exports = main;
