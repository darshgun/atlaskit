const { BITBUCKET_REPO_FULL_NAME } = process.env;

const getLinkMD = commit => {
  if (!BITBUCKET_REPO_FULL_NAME) {
    throw Error(
      '$BITBUCKET_REPO_FULL_NAME environment variable needs to be set',
    );
  }
  return `[${commit}](https://bitbucket.org/${BITBUCKET_REPO_FULL_NAME}/commits/${commit})`;
};

const getReleaseLine = async (changeset, versionType) => {
  const indentedSummary = changeset.summary
    .split('\n')
    .map(l => `  ${l}`.trimRight())
    .join('\n');

  return `- [${versionType}] ${getLinkMD(
    changeset.commit,
  )}:\n\n${indentedSummary}`;
};

const getDependencyReleaseLine = async (changesets, dependenciesUpdated) => {
  if (dependenciesUpdated.length === 0) return '';

  const changesetLinks = changesets.map(
    changeset => `- Updated dependencies ${getLinkMD(changeset.commit)}:`,
  );

  const updatedDepenenciesList = dependenciesUpdated.map(
    dependency => `  - ${dependency.name}@${dependency.newVersion}`,
  );

  return [...changesetLinks, ...updatedDepenenciesList].join('\n');
};

module.exports = {
  getReleaseLine,
  getDependencyReleaseLine,
};
