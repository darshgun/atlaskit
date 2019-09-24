function getDiffStatUrl(user, repo, sourcehash, destinationhash) {
  return `/2.0/repositories/${user}/${repo}/diffstat/${sourcehash}..${destinationhash}`;
}

function getFileUrl(user, repo, hash, filePath) {
  return `/2.0/repositories/${user}/${repo}/src/${hash}/${filePath}`;
}

function promisifyAPRequest(url) {
  console.log('making API req', url);
  return new Promise((resolve, reject) => {
    window.AP.require('request', request => {
      request({
        url,
        success(response) {
          console.log('SUCCESS:', response);
          resolve(response);
        },
        error(error) {
          console.warn('ERROR:', error);
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
    // console.log('VALUES', values);
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
  return getFullDiffStat(diffstatUrl).then(allDiffStats => {
    const relevantDiffs = allDiffStats
      .filter(diff => diff.status !== 'removed')
      .filter(
        diff =>
          diff.new &&
          diff.new.path &&
          diff.new.path.match(/\.changeset\/[^/]+?\.md$/),
      )
      .map(diff => getFileUrl(user, repo, sourcehash, diff.new.path));
    console.log('file urls', relevantDiffs);
    // .map(promisifyAPRequest);
    return Promise.all(relevantDiffs.map(promisifyAPRequest));
  });
}
