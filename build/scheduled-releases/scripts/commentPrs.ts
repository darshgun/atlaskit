import chalk from 'chalk';
import simpleGit from 'simple-git/promise';

import {
  DevelopBranchName,
  ReleaseBranchPrefix,
  ReleaseProjectLink,
  NextReleaseTagPrefix,
  ReleaseDocs,
} from '../constants';
import {
  getPrFromCommit,
  PullRequest,
  PullRequestClient,
} from '@atlaskit/build-utils/bitbucket';
import { createSpyObject } from '@atlaskit/build-utils/logging';
import { capitalise } from '../utils';

async function updatePrWithFutureRelease(
  prClient: PullRequestClient,
  matchedPr: PullRequest,
) {
  const git = simpleGit('./');

  const nextReleaseTagPattern = `${NextReleaseTagPrefix}*`;
  const nextReleaseTag = await git.raw(
    `describe --match ${nextReleaseTagPattern} origin/${DevelopBranchName}`.split(
      ' ',
    ),
  );
  const nextRelease = capitalise(
    nextReleaseTag.replace(NextReleaseTagPrefix, ''),
  ).trim();
  await prClient.addReleaseComment(
    matchedPr.id,
    'Scheduled to be released',
    `in \`${nextRelease}\`.\n
Links: [Schedule](${ReleaseProjectLink}) | [Scheduled Release Process](${ReleaseDocs})`,
  );
}

function updateAllPrsWithRelease() {
  console.log('UNIMPLEMENTED - Updating all PRs with release');
}

type Opts = {
  dryRun: boolean;
};

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
  const prClient = opts.dryRun
    ? createSpyObject<PullRequestClient>('PullRequestClient')
    : new PullRequestClient({
        auth: {
          username: BITBUCKET_USER,
          password: BITBUCKET_PASSWORD,
        },
        repoFullName,
      });
  if (targetBranch === DevelopBranchName) {
    await updatePrWithFutureRelease(prClient, matchedPr);
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
  const args = process.argv.slice(2);
  const [commitHash, repoFullName] = args;
  const flags = args.filter(a => a.startsWith('--'));
  main(commitHash, repoFullName, {
    dryRun: flags.includes('--dryRun') || flags.includes('--dry-run'),
  }).catch(e => {
    console.error(chalk.red(e));
    process.exit(1);
  });
}
