function getDiffStatUrl(user, repo, sourcehash, destinationhash) {
  return `/2.0/repositories/${user}/${repo}/diffstat/${sourcehash}..${destinationhash}`;
}

function getFileUrl(user, repo, hash, filePath) {
  return `/2.0/repositories/${user}/${repo}/src/${hash}/${filePath}`;
}

function promisifyAPRequest(url, type = 'json') {
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
export default function getChangesetInfo(
  user,
  repo,
  sourcehash,
  destinationhash,
) {
  const diffstatUrl = getDiffStatUrl(user, repo, sourcehash, destinationhash);
  let v2 = false;
  return getFullDiffStat(diffstatUrl).then(allDiffStats => {
    const relevantDiffs = allDiffStats
      .filter(diff => diff.status !== 'removed')
      .filter(diff => {
        if (!(diff.new && diff.new.path)) return false;
        if (diff.new.path.match(/\.changeset\/[^/]+?\.md$/)) {
          v2 = true;
          return true;
        } else if (v2) {
          return false;
        }
        return diff.new.path.match(/\.changeset\/.+?\/changes.json$/);
      })
      .map(diff => getFileUrl(user, repo, sourcehash, diff.new.path))
      .map(url => promisifyAPRequest(url, v2 ? 'text' : 'json'));
    return {
      changesetPromise: Promise.all(relevantDiffs),
      v2,
    };
  });
}
