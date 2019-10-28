function getDiffStatUrl(repoName, sourcehash, destinationhash) {
  return `/2.0/repositories/${repoName}/diffstat/${sourcehash}..${destinationhash}`;
}

function getFileUrl(repoName, hash, filePath) {
  return `/2.0/repositories/${repoName}/src/${hash}/${filePath}`;
}

function promisifyAPRequest(url, type) {
  return new Promise((resolve, reject) => {
    window.AP.require('request', request => {
      request({
        url,
        responseType: type,
        success(response) {
          resolve(response);
        },
        error(error) {
          reject(error);
        },
      });
    });
  });
}

function getFullDiffStat(url, allValues = []) {
  return promisifyAPRequest(url).then(res => {
    const values = [...allValues, ...res.values];
    if (res.next) {
      return getFullDiffStat(res.next, values);
    }
    return values;
  });
}

/**
 * If we ever need to make this faster for large PRs, we could calculate the full
 * number of requests after the first request and make serveral at a time in
 * parallel.
 */
export default async function getChangesetsFromFiles(
  repoName,
  sourcehash,
  destinationhash,
  v2,
) {
  const diffstatUrl = getDiffStatUrl(repoName, sourcehash, destinationhash);
  const allDiffStats = await getFullDiffStat(diffstatUrl);
  const relevantDiffs = allDiffStats.filter(diff => diff.new && diff.new.path);

  const changesets = relevantDiffs
    .filter(diff => diff.new.path.match(/\.changeset\/[^/]+?\/changes\.json$/))
    .map(diff => getFileUrl(repoName, sourcehash, diff.new.path))
    .map(url => promisifyAPRequest(url, 'json'));

  const v2Changesets = relevantDiffs
    .filter(diff => !diff.new.path.match(/\.changeset\/README\.md$/))
    .filter(diff => diff.new.path.match(/\.changeset\/[^/]+?\.md$/))
    .map(diff => getFileUrl(repoName, sourcehash, diff.new.path))
    .map(url => promisifyAPRequest(url, 'text'));

  return {
    v1changesets: await Promise.all(changesets),
    v2changesets: await Promise.all(v2Changesets),
  };
}
