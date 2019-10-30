import chalk from 'chalk';
import meow from 'meow';
import simpleGit, { SimpleGit } from 'simple-git/promise';
import { ValidationError } from '@atlaskit/build-utils/errors';
import { DevelopBranchName, ReleaseBranchPrefix } from './constants';
import { createSpyObject } from '@atlaskit/build-utils/logging';

type Options = {
  dryRun: boolean;
};

const defaultOpts: Options = {
  dryRun: false,
};

export default async function main(
  releaseName: string,
  nextReleaseName: string,
  userOpts: Partial<Options> = {},
) {
  if (!releaseName || !nextReleaseName) {
    throw new ValidationError(
      'Must supply the current release name and the next release name.',
    );
  }
  const opts = { ...defaultOpts, ...userOpts };
  const git = opts.dryRun ? createSpyObject<SimpleGit>('git') : simpleGit('./');

  process.stdout.write('Performing git fetch...');
  await git.fetch();
  console.log('Done.');

  const originDevelopBranch = `origin/${DevelopBranchName}`;
  const nextReleaseTagName = `next-release-start-${nextReleaseName}`;
  process.stdout.write(
    `Tagging ${originDevelopBranch} with start of next release...`,
  );
  await git.checkout(originDevelopBranch);
  await git.addTag(nextReleaseTagName);
  console.log('Done.');

  // @ts-ignore
  const releaseBranchName = `${ReleaseBranchPrefix}${releaseName}`;
  process.stdout.write(
    `Checking out release branch from ${originDevelopBranch}...`,
  );
  await git.checkoutBranch(releaseBranchName, originDevelopBranch);
  console.log('Done.');

  process.stdout.write('Pushing release branch and next release tag...');
  // git.push does not support pushing multiple refs
  await git.raw(['push', 'origin', releaseBranchName, nextReleaseTagName]);
  console.log('Done.');
}

if (require.main === module) {
  const cli = meow(
    `
    Usage
        $ create-release <releaseName> <nextReleaseName>

      Options
        --dry-run, -d         Perform a dry run

      Examples
        $ create-release elastiq flannel
`,
    {
      description:
        'Creates a new release branch and tags the next release name',
      flags: {
        dryRun: {
          type: 'boolean',
          alias: 'd',
        },
      },
    },
  );

  const [releaseName, nextReleaseName] = cli.input;

  main(releaseName, nextReleaseName, cli.flags).catch(e => {
    if (e instanceof ValidationError) {
      console.error(chalk.red(e.message));
      cli.showHelp(2);
    }
    console.error(chalk.red(e));
    process.exit(1);
  });
}
