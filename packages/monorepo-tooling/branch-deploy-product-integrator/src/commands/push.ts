import fs from 'fs';
import chalk from 'chalk';
import simpleGit, { SimpleGit } from 'simple-git/promise';
import util from 'util';
import childProcess from 'child_process';
import { debugMock, Default } from '../lib/util';

//@ts-ignore
import installFromCommit from '@atlaskit/branch-installer';

import fetch from 'node-fetch';
import { triggerProductBuild } from '../lib/ci';
import {
  commitAndPush,
  checkoutOrCreate,
  isInsideRepo,
  mergeAndReApply,
} from '../lib/git';
import { ValidationError, ErrorType } from '../types';
import { getWorkspaceDirs } from '../lib/packageEngine';

const exec = util.promisify(childProcess.exec);
const writeFile = util.promisify(fs.writeFile);

const defaultFlags = {
  branchPrefix: 'atlaskit-branch-deploy-',
  // Need to tighten default string type to 'upgrade'
  cmd: 'upgrade' as 'upgrade',
  dedupe: false,
  dryRun: false,
  packageEngine: 'yarn',
  packages: 'all',
};

type Flags = {
  branchPrefix: string;
  cmd: 'add' | 'upgrade';
  dedupe: boolean;
  dryRun: boolean;
  packageEngine: string;
  packages: string;
  productCiPlanUrl?: string;
};

type UserFlags = Default<Flags, keyof typeof defaultFlags>;

export class PushValidationError extends Error implements ValidationError {
  type: ErrorType = 'push';
}

// prettier-ignore
export const HELP_MSG = `
  🚀 Atlaskit branch deploy product integrator™ 🚀

  ${chalk.yellow('push <atlaskitBranchName> <atlaskitCommitHash>')} Installs an atlaskit branch deploy and pushes it to a product repo

  where ${chalk.yellow('<atlaskitBranchName>')} is the name of the Atlaskit branch being installed and ${chalk.yellow('<atlaskitCommitHash>')} is the atlaskit commit hash of the branch deploy that needs to be installed.

   ${chalk.green('Options')}
     ${chalk.yellow('--branchPrefix')} Prefix for the generated branch [default=atlaskit-branch-deploy/]
     ${chalk.yellow('--cmd')} the command to use can be add or upgrade [default=upgrade]
     ${chalk.yellow('--dedupe')} run yarn deduplicate at the end to deduplicate the lock file
     ${chalk.yellow('--dryRun')} Log out commands that would be run instead of running them
     ${chalk.yellow('--packageEngine')} The package manager to use, currently only tested with Bolt and yarn [default=yarn]
     ${chalk.yellow('--packages')} comma delimited list of packages to install branch deploy of
     ${chalk.yellow('--productCiPlanUrl')} Base URL of the product CI's plan rest endpoint, including build key.
     ${chalk.yellow('--')} Any arguments after -- will be appended to the upgrade command

  ${chalk.green('Environment Variables')}
    ${chalk.yellow('PRODUCT_CI_USERNAME')} Username to authenticate product CI API requests with, used in conjunction with --productCiPlanUrl
    ${chalk.yellow('PRODUCT_CI_PASSWORD')} Password to authenticate product CI API requests with, used in conjunction with --productCiPlanUrl

  ${chalk.green('Examples')}
    ${chalk.yellow('branch-deploy-product-integrator foo abcdef123456 --productCiPlanUrl https://bamboo.atlassian.com/rest/api/latest/plan/ABC-DEF')}

`;

function createBranchName(atlaskitBranchName: string, prefix: string) {
  return `${prefix}${atlaskitBranchName}`.replace(/\//g, '-');
}

async function createVersionFile(akCommitHash: string) {
  const versionFileName = '.atlaskit-version';
  const payload = { akCommitHash };
  await writeFile(versionFileName, JSON.stringify(payload), 'utf8');
}

function validateArgs(
  atlaskitBranchName: string,
  atlaskitCommitHash: string,
  flags: Flags,
): flags is Flags {
  const {
    branchPrefix,
    packageEngine,
    packages,
    dedupe,
    cmd,
    dryRun,
    productCiPlanUrl,
    ...rest
  } = flags;
  if (!atlaskitBranchName || !atlaskitCommitHash) {
    throw new PushValidationError(
      'Missing atlaskitBranchName or atlaskitCommitHash',
    );
  }

  const invalidFlags = Object.keys(rest);
  if (invalidFlags.length > 0) {
    throw new PushValidationError(`Invalid flags: ${invalidFlags}`);
  }

  return true;
}

export async function push(
  atlaskitBranchName: string,
  atlaskitCommitHash: string,
  userFlags: UserFlags,
  extraArgs: string[] = [],
) {
  const flags = { ...defaultFlags, ...userFlags };
  if (!validateArgs(atlaskitBranchName, atlaskitCommitHash, flags)) {
    return;
  }
  const {
    branchPrefix,
    packageEngine,
    packages,
    dedupe,
    cmd,
    dryRun,
    productCiPlanUrl,
  } = flags;

  const git = dryRun ? (debugMock('git') as SimpleGit) : simpleGit('./');
  const branchName = createBranchName(atlaskitBranchName, branchPrefix);

  const insideAtlaskit =
    !dryRun && (await isInsideRepo(git, 'atlassian/atlaskit-mk-2'));

  if (insideAtlaskit) {
    throw new Error('Working path should not be the Atlaskit repo!');
  }

  await checkoutOrCreate(git, branchName);
  const workspacePkgJsons = (await getWorkspaceDirs(packageEngine)).map(
    dir => `${dir}/package.json`,
  );
  /* We merge master so that the branch remains relatively up to date.
   * We also reset package.json/yarn.lock back to their state on master before running
   * a branch install to prevent previous branch installs lingering in package.json.
   */
  await mergeAndReApply(git, 'origin/master', [
    'package.json',
    'yarn.lock',
    ...workspacePkgJsons,
  ]);

  console.log(`Installing packages branch deployed from ${atlaskitCommitHash}`);
  await installFromCommit(atlaskitCommitHash, {
    engine: packageEngine,
    cmd: cmd,
    packages: packages,
    timeout: 30 * 60 * 1000, // Takes between 15 - 20 minutes to build a AK branch deploy
    interval: 30000,
    extraArgs,
    dryRun,
  });

  const commitInfo = await (
    await fetch(
      `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/commit/${atlaskitCommitHash}`,
      {},
    )
  ).json();
  const emailRegex = /^.*<([A-z]+@atlassian.com)>$/;

  let authorEmail = 'no-reply@atlassian.com';
  if (commitInfo.author.raw.match(emailRegex)) {
    authorEmail = commitInfo.author.raw.replace(emailRegex, '$1');
  }

  // prettier-ignore
  const commitMessage = `Upgraded to Atlaskit changes on branch ${atlaskitBranchName}

https://bitbucket.org/atlassian/atlaskit-mk-2/branch/${atlaskitBranchName}

This commit was auto-generated.
  `;

  await createVersionFile(atlaskitCommitHash);

  console.log('Pushing branch deployed versions');
  const didCommit = await commitAndPush(
    git,
    commitMessage,
    authorEmail,
    branchName,
  );

  // Only run the following steps if we actually committed and pushed something
  if (didCommit) {
    if (dedupe) {
      console.log(chalk.yellow('Running yarn-deduplicate'));
      await exec('yarn yarn-deduplicate yarn.lock');

      console.log('Pushing deduped yarn.lock');
      await commitAndPush(
        git,
        'Deduplicated yarn.lock file',
        authorEmail,
        branchName,
      );
    }

    if (productCiPlanUrl) {
      const { PRODUCT_CI_USERNAME, PRODUCT_CI_PASSWORD } = process.env;
      if (!PRODUCT_CI_USERNAME || !PRODUCT_CI_PASSWORD) {
        throw Error(
          'Missing $PRODUCT_CI_USERNAME and/or $PRODUCT_CI_PASSWORD environment variables',
        );
      }

      console.log(
        `Triggering product build on ${productCiPlanUrl} for ${branchName}`,
      );
      if (!dryRun) {
        await triggerProductBuild(productCiPlanUrl, branchName, {
          username: PRODUCT_CI_USERNAME,
          password: PRODUCT_CI_PASSWORD,
        });
      }
    }
  }

  console.log('Branch deploy product integrator success!');
}
