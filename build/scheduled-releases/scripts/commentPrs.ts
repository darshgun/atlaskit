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
import { capitalise, addReleaseComment } from '../utils';

const {
  BITBUCKET_USER,
  BITBUCKET_PASSWORD,
  BITBUCKET_REPO_FULL_NAME,
} = process.env;

async function updatePrWithFutureRelease(
  prClient: PullRequestClient,
  matchedPr: PullRequest,
) {
  const git = simpleGit('./');

  const nextReleaseTagPattern = `${NextReleaseTagPrefix}*`;
  // --abbrev=0 flag suppresses long format which appends commit & hash info
  // --first-parent follows only the first parent of merges, to filter out other branches merged in history
  const nextReleaseTag = await git.raw(
    `describe --abbrev=0 --first-parent --match ${nextReleaseTagPattern} origin/${DevelopBranchName}`.split(
      ' ',
    ),
  );
  const nextRelease = capitalise(
    nextReleaseTag.replace(NextReleaseTagPrefix, ''),
  ).trim();
  await addReleaseComment(
    prClient,
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
  repoFullName: string,
  userOpts: Partial<Opts> = {},
) {
  if (!BITBUCKET_USER || !BITBUCKET_PASSWORD || !BITBUCKET_REPO_FULL_NAME) {
    throw Error(
      '$BITBUCKET_USER or $BITBUCKET_PASSWORD or $BITBUCKET_REPO_FULL_NAME environment variables not set',
    );
  }
  const opts: Opts = { ...defaultOpts, ...userOpts };

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
