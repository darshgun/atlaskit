// @flow
/* This helper creates the folder per entry point and add a package.json that maps the path to the entry point .*/
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const bolt = require('bolt');
const { getPackagesInfo } = require('@atlaskit/build-utils/tools');

const writeFile = promisify(fs.writeFile);

async function writeEntryPointsPathInPkgJson(
  isTs /*: boolean */,
  pkg /*: Object */,
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

async function createEntryPointsDirWithPkgJson(opts /*: Object */ = {}) {
  const { cwd = process.cwd(), packageName, errorOnExistingDirs = true } = opts;
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;
  const packages = await getPackagesInfo(cwd, opts);
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
  const existingDirs = [];
  for (const pkg of pkgContents) {
    for (let pkgFile of pkg.files) {
      const isTs = pkgFile.includes('.ts');
      pkgFile = path.parse(pkgFile).name;
      const entryPointDirName = path.join(pkg.pkgDirPath, pkgFile);
      if (!fs.existsSync(entryPointDirName)) {
        fs.mkdirSync(entryPointDirName);
      }
      const dirContents = fs.readdirSync(entryPointDirName);
      if (
        dirContents.length > 1 ||
        (dirContents.length === 1 && dirContents[0] !== 'package.json')
      ) {
        // Existing directories outside of src won't break anything since the package.json entry point will still be added there
        // and uploaded to npm. Problems would arise if the directory was already npmignored though
        existingDirs.push({
          dir: path.relative(projectRoot, entryPointDirName),
          pkgFile,
        });
      }
      await writeEntryPointsPathInPkgJson(
        isTs,
        pkg,
        pkgFile,
        entryPointDirName,
      );
    }
  }
  if (errorOnExistingDirs && existingDirs.length > 0) {
    throw new Error(
      `\tThe following directories clash with generated entry point directories:\n\tClashing dirs: ${existingDirs
        .map(p => p.dir)
        .join(', ')}`,
    );
  }
}

module.exports = {
  createEntryPointsDirWithPkgJson,
  writeEntryPointsPathInPkgJson,
};
