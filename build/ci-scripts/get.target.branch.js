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

const getPrFromCommit = require('./bitbucket-utils/getPrFromCommit');

async function main() {
  const { BITBUCKET_COMMIT, BITBUCKET_REPO_FULL_NAME } = process.env;
  if (!BITBUCKET_COMMIT || !BITBUCKET_REPO_FULL_NAME) {
    throw Error(
      `Expected $BITBUCKET_COMMIT and $BITBUCKET_REPO_FULL_NAME variables to be set but they were not found`,
    );
  }

  const matchedPr = await getPrFromCommit(
    BITBUCKET_COMMIT,
    BITBUCKET_REPO_FULL_NAME,
  );
  if (!matchedPr) {
    throw Error(`No PR found for commit ${BITBUCKET_COMMIT}`);
  }

  return matchedPr.destination.branch.name;
}

if (require.main === module) {
  main()
    .then(targetBranch => {
      console.log(targetBranch);
    })
    .catch(e => {
      console.error(e.message || e);
      process.exit(1);
    });
}

module.exports = main;
