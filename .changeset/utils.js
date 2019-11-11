// This function takes information about what dependencies we are updating in the package.
// It provides an array of related changesets, as well as the dependencies updated.

/*
- Updated dependencies: [ABCDEFG]:
- Updated dependencies: [HIJKLMN]:
  - dependencyA@1.0.1
  - dependencyb@1.2.0
*/
export const getDependencyReleaseLine = async (
  changesets,
  dependenciesUpdated,
) => {
  if (dependenciesUpdated.length === 0) return '';

  const changesetLinks = changesets.map(
    changeset => `- Updated dependencies [${changeset.commit}]:`,
  );

  const updatedDepenenciesList = dependenciesUpdated.map(
    dependency => `  - ${dependency.name}@${dependency.version}`,
  );

  return [...changesetLinks, ...updatedDepenenciesList].join('\n');
};

export async function getReleaseLines(changesets, releaseName, config) {
  return Promise.all(
    changesets.map(async changeset => {
      const relevantRelease = changeset.releases.find(
        r => r.name === releaseName,
      );
      return config.getReleaseLine(changeset, relevantRelease.type);
    }),
  );
}
