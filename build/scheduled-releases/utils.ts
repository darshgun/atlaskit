/**
 * Utils
 */
import { ReleasePrefix } from './constants';
import { PullRequestClient } from '@atlaskit/build-utils/bitbucket';

export function capitalise(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

/** Adds a scheduled release comment to `prId`, replacing any existing comments that start with `prefixIdentifier`. */
export async function addReleaseComment(
  prClient: PullRequestClient,
  prId: number,
  prefixIdentifier: string,
  text: string,
) {
  const fullPrefix = `${ReleasePrefix} ${prefixIdentifier}`;
  const comments = await prClient.getComments(prId, {
    q: `content.raw ~ "${fullPrefix}" AND deleted = false`,
  });
  if (comments.size > 0) {
    if (comments.size > 1) {
      console.error(
        `Found more than one comment with prefix '${fullPrefix}' in PR #${prId}. There should only be 0 or 1.`,
      );
    }
    for (const comment of comments.values) {
      await prClient.deleteComment(prId, comment);
    }
  }

  await prClient.addComment(prId, `${fullPrefix} ${text}`);
}
