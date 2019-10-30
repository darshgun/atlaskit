import chalk from 'chalk';
import simpleGit from 'simple-git/promise';

import { DevelopBranchName, ReleaseBranchPrefix } from '../constants';
import {
  getPrFromCommit,
  PullRequest,
  PullRequestClient,
} from '@atlaskit/build-utils/bitbucket';

type Opts = {
  dryRun: boolean;
};

async function updatePrWithFutureRelease(
  prClient: PullRequestClient,
  matchedPr: PullRequest,
  opts: Opts,
) {
  // @ts-ignore
  const git = simpleGit('./');

  // TODO: Obtain this somehow, maybe as part of a git tag
  const nextRelease = 'flannel';
  await prClient.addReleaseComment(
    matchedPr.id,
    'Scheduled to release',
    `in the \`${nextRelease}\` release`,
  );
}

function updateAllPrsWithRelease() {
  console.log('Updating all PRs with release');
}

const defaultOpts = {
  dryRun: false,
};

/** Updates any pull requests relevant to scheduled releases with comments pertaining to the release that the PR will or has been released in.
 *  Pre-requisites:
 *    Environment variables:
 *      BITBUCKET_USER: Bitbucket username - comments will be posted under this user
 *      BITBUCKET_PASSWORD: Bitbucket password
 */
export default async function main(
  commitHash: string,
  repoFullName: string = 'atlassian/atlaskit-mk-2',
  userOpts: Partial<Opts> = {},
) {
  const opts: Opts = { ...defaultOpts, ...userOpts };
  const { BITBUCKET_USER, BITBUCKET_PASSWORD } = process.env;
  if (!BITBUCKET_USER || !BITBUCKET_PASSWORD) {
    throw Error(
      '$BITBUCKET_USER or $BITBUCKET_PASSWORD environment variables not set',
    );
  }
  const matchedPr: PullRequest | undefined = await getPrFromCommit(
    commitHash,
    repoFullName,
  );
  if (!matchedPr) {
    throw Error(`Cannot find PR for commit ${commitHash}`);
  }
  const sourceBranch = matchedPr.source.branch.name;
  const targetBranch = matchedPr.destination.branch.name;
  const prClient = new PullRequestClient({
    auth: {
      username: BITBUCKET_USER,
      password: BITBUCKET_PASSWORD,
    },
    repoFullName,
  });
  if (targetBranch === DevelopBranchName) {
    await updatePrWithFutureRelease(prClient, matchedPr, opts);
  } else if (
    targetBranch === 'master' &&
    sourceBranch.startsWith(ReleaseBranchPrefix)
  ) {
    updateAllPrsWithRelease();
  } else {
    console.log('PR updates not required');
  }
}

if (require.main === module) {
  const [commitHash, repoFullName] = process.argv.slice(2);
  main(commitHash, repoFullName).catch(e => {
    console.error(chalk.red(e));
    process.exit(1);
  });
}
