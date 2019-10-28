/**
 * Retrieves an open PR containing `commitHash` as the top source commit, or `undefined` if none exist.
 * Will throw if more than one PR is found.
 */
const https = require('https');

// We use the node https library so that we can run this script without installing any dependencies
// even though we have to add some extra wrapping functions
function httpGetRequest(url) {
  return new Promise((resolve, reject) => {
    let data = '';

    const req = https.get(url, resp => {
      resp.on('data', chunk => (data += chunk));
      resp.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', err => reject(err));
  });
}

/**
 * @param commitHash string Commit hash, minimum 12 chars
 * @param repoFullName string Full name of the repo, i.e. <owner>/<repoName>
 *
 * @return PR Object or undefined
 */
async function getPrFromCommit(commitHash, repoFullName) {
  if (!commitHash || !repoFullName) {
    throw Error('Missing commitHash or repoFullName');
  }

  // We sort descending on created_on to get newest first and only look at open PRs
  let endpoint = `https://api.bitbucket.org/2.0/repositories/${repoFullName}/pullrequests?sort=-created_on&state=OPEN&pagelen=20`;
  let response;
  let matchedPr;

  do {
    response = await httpGetRequest(endpoint);
    if (!response || !response.values) {
      throw Error(
        `Response is not in the format we expected. Received:\n${response}`,
      );
    }
    const openPRs = response.values.filter(
      pr =>
        pr.source &&
        pr.source.commit &&
        pr.source.commit.hash &&
        commitHash.startsWith(pr.source.commit.hash),
    );
    if (openPRs.length === 1) {
      matchedPr = openPRs[0];
    } else if (openPRs.length > 1) {
      throw Error(
        `Found multiple open PRs for commit ${commitHash}. PR ids: ${openPRs.map(
          pr => pr.id,
        )}`,
      );
    }
    endpoint = response.next;
  } while (!matchedPr && response.next);

  return matchedPr;
}

module.exports = getPrFromCommit;
