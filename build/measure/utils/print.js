// @flow
function processJoinedStats(
  measureGroups /*: Array<Object> */,
  stats /*: Array<Object> */,
) {
  // $FlowFixMe - type issue
  return measureGroups
    .map(group => ({
      ...group,
      stats: group.stats
        .reduce((acc, statDecl) => {
          if (statDecl.group) {
            acc.push(...processJoinedStats([statDecl], stats));
          } else {
            acc.push(stats[statDecl.id]);
          }
          return acc;
        }, [])
        .filter(Boolean),
    }))
    .filter(gr => gr.stats.length);
}

function prepareForPrint(
  measureGroups /*: Array<Object> */,
  stats /*: Array<Object> */,
) {
  const joinedStats = stats.reduce((acc, stat) => {
    acc[stat.id] = stat;
    return acc;
  }, {});
  // $FlowFixMe - type issue
  return processJoinedStats(measureGroups, joinedStats);
}

module.exports = { prepareForPrint };
