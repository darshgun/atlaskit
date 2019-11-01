// @flow
const path = require('path');
const bolt = require('bolt');

const getNpmDistPath = pkgName => path.join(process.cwd(), 'dists', pkgName);

async function getAllPublicPackages(cwd) {
  const allWorkspaces = await bolt.getWorkspaces({
    cwd,
  });

  return allWorkspaces
    .map(({ dir, config: { name, isPrivate, version } }) => ({
      dir,
      name,
      version,
      isPrivate,
    }))
    .filter(p => !p.isPrivate);
}

module.exports = {
  getAllPublicPackages,
  getNpmDistPath,
};
