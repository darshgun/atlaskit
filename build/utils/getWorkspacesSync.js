//@flow

/*
 * Utilities helper to get workspaces sync.
 */

const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');

function getWorkspacesSync() {
  const rootPkgJsonPath = path.join(process.cwd(), 'package.json');
  const rootPkgJson = JSON.parse(fs.readFileSync(rootPkgJsonPath, 'utf-8'));

  const boltWorkspacesGlobs = rootPkgJson.bolt.workspaces;

  const folders = globby.sync(boltWorkspacesGlobs, {
    onlyDirectories: true,
    absolute: true,
    expandDirectories: false,
  });

  const pkgJsonsMissingNameField /*: Array<string>*/ = [];

  const results = folders
    .sort()
    .filter(dir => fs.existsSync(path.join(dir, 'package.json')))
    .map(dir => {
      const contents = fs.readFileSync(path.join(dir, 'package.json'), 'utf8');
      const config = JSON.parse(contents);
      if (!config.name) {
        pkgJsonsMissingNameField.push(
          path.relative(process.cwd(), path.join(dir, 'package.json')),
        );
      }
      return { config, name: config.name, dir };
    });
  if (pkgJsonsMissingNameField.length !== 0) {
    pkgJsonsMissingNameField.sort();
    throw new Error(
      `The following package.jsons are missing the "name" field:\n${pkgJsonsMissingNameField.join(
        '\n',
      )}`,
    );
  }
  return results;
}

module.exports = { getWorkspacesSync };
