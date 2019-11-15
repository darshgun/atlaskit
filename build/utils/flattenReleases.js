// @flow
function maxType(types) {
  if (types.includes('major')) return 'major';
  if (types.includes('minor')) return 'minor';
  if (types.includes('patch')) return 'patch';
  return 'none';
}

function flattenReleases(changesets /*: Object*/) {
  const abc = changesets
    .map(changeset => [
      ...changeset.releases.map(release => ({
        name: release.name,
        type: release.type,
        commit: changeset.commit,
      })),
      ...changeset.dependents.map(dependent => ({
        name: dependent.name,
        type: dependent.type,
        commit: changeset.commit,
      })),
    ])
    .reduce((acc, a) => [...acc, ...a], []) // flatten
    .reduce((acc, release) => {
      if (!acc[release.name]) {
        acc[release.name] = [];
      }
      acc[release.name].push(release);
      return acc;
    }, {});
  // $FlowFixMe - map issues
  return Object.entries(abc).map(([name, releases]) => ({
    name, // $FlowFixMe - map issues
    type: maxType(releases.map(r => r.type)), // $FlowFixMe - map issues
    commits: [...new Set(releases.map(r => r.commit))],
  }));
}

module.exports = flattenReleases;
