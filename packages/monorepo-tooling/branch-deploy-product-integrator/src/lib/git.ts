/** Git utils */
import { SimpleGit } from 'simple-git/promise';

// Returns a boolean indicating if it committed or not
// Returns false when there are no changes to commit
export async function commitAndPush(
  git: SimpleGit,
  commitMessage: string,
  authorEmail: string,
  branchName: string,
): Promise<boolean> {
  await git.add(['./']);

  const status = await git.status();
  if (status && status.staged.length === 0) {
    console.log('Nothing to commit');
    return false;
  }

  await git.commit(commitMessage, [
    '--author',
    `BOT Atlaskit branch deploy integrator <${authorEmail}>`,
  ]);
  await git.push('origin', branchName);

  console.log('Committed and pushed changes');

  return true;
}

/**
 * This function merges `branchName` and reapplies `files` to their original state from `branchName`.
 * If merge conflicts arise and the only conlicts are those in `files`, they will be resolved by resetting
 * to their state since that will happen regardless.
 */
export async function mergeAndReApply(
  git: SimpleGit,
  branchName: string,
  files: string[],
) {
  let mergeError;
  try {
    console.log(`Merging ${branchName} into current branch`);
    await git.merge([branchName]);
  } catch (error) {
    // Conflicts or another type of error
    mergeError = error;
  }

  if (mergeError == null) {
    console.log('Merge succeeded with no conflicts');
  } else {
    console.log('Found merge conflicts...attempting to resolve');
    const status = await git.status();
    const conflicts = status.conflicted;
    if (conflicts.length === 0) {
      // If we have no conflicts, the merge failed for another reason
      throw mergeError;
    }
    if (conflicts.some(c => !files.includes(c))) {
      throw new Error(`Found conflicts other than ${files}. Cannot proceed`);
    }

    await git.checkout(['--theirs', ...files]);
    await git.add(files);

    // --no-edit uses the default commit message
    await git.commit([], undefined, { '--no-edit': true });
  }

  // Reset the files to their version on branchName
  console.log(`Resetting ${files} back to their state on ${branchName}`);
  await git.checkout([branchName, '--', ...files]);
}

export async function checkoutOrCreate(git: SimpleGit, branchName: string) {
  let branchExists;

  try {
    await git.revparse(['--verify', `origin/${branchName}`]);
    branchExists = true;
  } catch (error) {
    branchExists = false;
  }

  if (branchExists) {
    console.log(`Pulling existing branch ${branchName}`);
    await git.checkout(branchName);
    await git.pull('origin', branchName);
  } else {
    console.log(`Checking out new branch ${branchName}`);
    await git.checkoutBranch(branchName, 'origin/master');
  }
}

export async function isInsideRepo(git: SimpleGit, repoName: string) {
  const remote = await git.listRemote(['--get-url']);

  return remote.indexOf(repoName) > -1;
}
