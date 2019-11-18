// @flow
const bolt = require('bolt');
const path = require('path');

async function getChangesetBase(cwd /*: string */) {
  const { dir } = await bolt.getProject({ cwd });
  return path.resolve(dir, '.changeset');
}

module.exports = getChangesetBase;
