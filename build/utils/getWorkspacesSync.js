//@flow
'use strict';
/*
 * Utilities helper to get workspaces sync.
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

/*::
type Options = {
  cwd?: string,
  tools:  Array<"yarn" | "bolt" | "root">
}
*/

/*::
type PackageJSON = {
  name: string,
  version: string,
  dependencies?: { [key: string]: string },
  peerDependencies?: { [key: string]: string },
  devDependencies?: { [key: string]: string },
  optionalDependencies?: { [key: string]: string },
  private?: boolean,
};
*/

/*::
type Workspace = { 
  config: PackageJSON,
  name: string,
  dir: string,
};
*/

function getWorkspacesSync(opts /*: Options */) {
  const cwd = opts.cwd || process.cwd();
  const tools = opts.tools || ['yarn', 'bolt']; // We also support root, but don't do it by default

  const pkg = fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8');
  console.log(typeof pkg);
  let workspaces;

  if (tools.includes('yarn') && pkg.workspaces) {
    if (Array.isArray(pkg.workspaces)) {
      workspaces = pkg.workspaces;
    } else if (pkg.workspaces.packages) {
      workspaces = pkg.workspaces.packages;
    }
  } else if (tools.includes('bolt') && pkg.bolt && pkg.bolt.workspaces) {
    workspaces = pkg.bolt.workspaces;
  }
  if (!workspaces) {
    if (tools.includes('root')) {
      return [{ config: pkg, dir: cwd, name: pkg.name }];
    }
    return null;
  }

  const folders = glob(workspaces, {
    cwd,
    onlyDirectories: true,
    absolute: true,
    expandDirectories: false,
  });

  let pkgJsonsMissingNameField /*: Array<string>*/ = [];

  const results = folders
    .sort()
    .filter(dir => fs.existsSync(path.join(dir, 'package.json')))
    .map(dir => {
      const contents = fs.readFileSync(path.join(dir, 'package.json'), 'utf8');
      const config = JSON.parse(contents);
      if (!config.name) {
        pkgJsonsMissingNameField.push(
          path.relative(cwd, path.join(dir, 'package.json')),
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
