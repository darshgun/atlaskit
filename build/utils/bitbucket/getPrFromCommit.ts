import https from 'https';
import { PaginatedPullRequests, PullRequest } from './types';

// We use the node https library so that we can run this script without installing any dependencies
// even though we have to add some extra wrapping functions
function httpGetRequest(url: string, auth: string) {
  const options = {
    path: url,
    headers: {
      Authorization: `Basic ${auth}`,
    },
  };
  return new Promise((resolve, reject) => {
    let data = '';

    const req = https.get(options, resp => {
      resp.on('data', chunk => (data += chunk));
      resp.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', err => reject(err));
  });
}

/**
 * Retrieves an open PR containing `commitHash` as the top source commit, or `undefined` if none exist.
 * Will throw if more than one PR is found. Commit hash requires 12 chars minimum.
 */
export async function getPrFromCommit(
  commitHash: string,
  repoFullName: string,
) {
  const { BITBUCKET_USER, BITBUCKET_PASSWORD } = process.env;

  const auth = Buffer.from(`${BITBUCKET_USER}:${BITBUCKET_PASSWORD}`).toString(
    'base64',
  );

  if (!commitHash || !repoFullName || !auth) {
    throw Error('Missing commitHash or repoFullName or auth');
  }

  // We sort descending on created_on to get newest first and only look at open PRs
  let endpoint:
    | string
    | undefined = `https://api.bitbucket.org/2.0/repositories/${repoFullName}/pullrequests?sort=-created_on&state=OPEN&pagelen=20`;
  let response: PaginatedPullRequests;
  let matchedPr: PullRequest | undefined;

  do {
    // TODO: TS 3.7 assertion
    if (!endpoint) {
      throw Error('Missing endpoint');
    }
    response = (await httpGetRequest(endpoint, auth)) as PaginatedPullRequests;
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
