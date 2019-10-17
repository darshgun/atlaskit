const fs = require('fs');
const path = require('path');

const simpleGit = require('simple-git')(path.join(__dirname, '..', '..'));
const CHANGESET_DIR = path.join(__dirname, '..', '..', '.changeset');

const randomName = `empty-${new Date() % 100}`;
const changesetDir = path.join(CHANGESET_DIR, randomName);
const changesMdPath = path.join(changesetDir, 'changes.md');
const changesJsonPath = path.join(changesetDir, 'changes.json');

const changesMdContent = `**This is an empty changeset - created because we are not releasing anything**`;
const emptyChangeset = {
  releases: [],
  dependents: [],
};

fs.mkdirSync(changesetDir);
fs.writeFileSync(changesMdPath, changesMdContent);
fs.writeFileSync(changesJsonPath, JSON.stringify(emptyChangeset, null, 2));

simpleGit
  .add([changesMdPath, changesJsonPath])
  .commit('Adding empty changeset files.');

console.log(`Created empty changeset in ${changesJsonPath}`);
