/* This helper creates the folder per entry point and add a package.json that maps the path to the entry point .*/
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;
const { getPackagesInfo } = require('@atlaskit/build-utils/tools');

const writeFile = promisify(fs.writeFile);

async function writeEntryPointsPathInPkgJson(
  isTs,
  pkg,
  pkgFile,
  entryPointDirName,
) {
  // Add a package.json
  const types = isTs ? `../dist/cjs/${pkgFile}.d.ts` : undefined;
  const entryPointJson = {
    name: `${pkg.name}/${pkgFile}`,
    main: `../dist/cjs/${pkgFile}.js`,
    module: `../dist/esm/${pkgFile}.js`,
    types,
  };
  return writeFile(
    `${entryPointDirName}/package.json`,
    JSON.stringify(entryPointJson, null, 2),
    err => {
      if (err) console.log(err);
    },
  );
}

async function createEntryPointsDirWithPkgJson({
  buildIsClean,
  cwd,
  packageName,
} = {}) {
  const resolvedCwd = cwd || process.cwd();
  const packages = await getPackagesInfo(resolvedCwd);
  const pkgContents = packages
    .filter(
      pkg =>
        pkg.dir.includes('/packages') &&
        (!packageName || packageName === pkg.name),
    )
    .map(pkg => {
      return {
        name: pkg.name,
        pkgDirPath: pkg.dir,
        files: fs
          .readdirSync(path.join(pkg.dir, 'src'))
          .filter(
            file =>
              file.includes('.') &&
              !file.includes('index') &&
              path.parse(file).name &&
              !file.includes('.d.ts') &&
              !file.includes('version.json'),
          ),
      };
    });
  const errors = [];
  for (let pkg of pkgContents) {
    for (let pkgFile of pkg.files) {
      const isTs = pkgFile.includes('.ts');
      pkgFile = path.parse(pkgFile).name;
      const entryPointDirName = path.join(pkg.pkgDirPath, pkgFile);
      if (!fs.existsSync(entryPointDirName)) {
        fs.mkdirSync(entryPointDirName);
      }
      const dirContents = fs.readdirSync(entryPointDirName);
      if (
        buildIsClean &&
        (dirContents.length > 1 || dirContents[0] === 'package.json')
      ) {
        errors.push(
          `Directory: ${entryPointDirName} outside of src has the same name: ${pkgFile} as a file in src/ this is not allowed`,
        );
      }
      await writeEntryPointsPathInPkgJson(
        isTs,
        pkg,
        pkgFile,
        entryPointDirName,
      );
    }
  }
  if (errors.length > 0) {
    throw Error(errors.join('\n'));
  }
}

module.exports = {
  createEntryPointsDirWithPkgJson,
  writeEntryPointsPathInPkgJson,
};
