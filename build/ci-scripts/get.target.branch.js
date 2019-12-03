// @flow
/**
 * This script is used in CI to check if the current build is for a PR and if so returns the destination
 * branch of that PR. This is used during landkid builds to know which branch landkid should rebase on
 * (as this may not always be master)
 *
 * Requirements:
 *   Expects the $BITBUCKET_COMMIT variable to be set (Pipelines does this)
 *   Expects the $BITBUCKET_REPO_FULL_NAME variable to be set (Pipelines does this)
 *
 * Output:
 *  On success will only output the name of the branch, i.e: issue/PTC-2673-user-picker-ie11
 *  On error will output an error message and exit with non-zero exit code
 */

const https = require('https');

const DEBUG = false; // NOTE: Turning this on will make the script output intermediate information
// which will actually cause anything using this to break. This flag should only be used for debugging

const { BITBUCKET_COMMIT, BITBUCKET_REPO_FULL_NAME } = process.env;

const debugLog = DEBUG ? console.log : () => {};

// We use the node https library so that we can run this script without installing any dependencies
// even though we have to add some extra wrapping functions
function httpGetRequest(url) {
  return new Promise((resolve, reject) => {
    let data = '';

    const req = https.get(url, resp => {
      // eslint-disable-next-line no-return-assign
      resp.on('data', chunk => (data += chunk));
      resp.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', err => reject(err));
  });
}

if (!BITBUCKET_COMMIT || !BITBUCKET_REPO_FULL_NAME) {
  console.error(
    `Expected $BITBUCKET_COMMIT and $BITBUCKET_REPO_FULL_NAME variables to be set but they were not found`,
  );
  console.error('Exiting');
  process.exit(1);
}

async function main() {
  const bbRepoFullName = BITBUCKET_REPO_FULL_NAME || '';
  const bbCommit = BITBUCKET_COMMIT || '';
  // We sort descending to on created_on to get neweset first and only look at open PRs
  let endpoint = `https://api.bitbucket.org/2.0/repositories/${bbRepoFullName}/pullrequests?sort=-created_on&state=OPEN&pagelen=20`;
  let response;
  let targetBranch = '';

  do {
    // $FlowFixMe - fix logger
    debugLog(`Fetching...${endpoint}`);
    response = await httpGetRequest(endpoint);
    if (!response || !response.values) {
      console.error('Response is not in the format we expected. Received:');
      console.log(response);
      process.exit(1);
    }
    const matchingPr = response.values.find(
      pr =>
        pr.source &&
        pr.source.commit &&
        pr.source.commit.hash &&
        bbCommit.startsWith(pr.source.commit.hash),
    );
    if (matchingPr) {
      targetBranch = matchingPr.destination.branch.name;
    }
    endpoint = response.next;
  } while (!targetBranch && response.next);

  if (!targetBranch) {
    console.error(`Error: No PR found for commit ${bbCommit}`);
    process.exit(1);
  }
  console.log(targetBranch);
}

main();
