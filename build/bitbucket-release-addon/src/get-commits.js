// @flow
import parseChangesetCommit from '@atlaskit/build-utils/parseChangesetCommit';

function commitsToValues(response /*: Object */) {
  return response.values;
}

function commitUrl(repoName /*: string */, pullrequestid /*: string */) {
  return `/2.0/repositories/${repoName}/pullrequests/${pullrequestid}/commits`;
}

function getCommits(
  repoName /*: string */,
  pullrequestid /*: string */,
  urlNext? /*: string */,
) {
  return new Promise((resolve, reject) => {
    window.AP.require('request', request => {
      request({
        url: urlNext || commitUrl(repoName, pullrequestid),
        success(response) {
          if (response.next) {
            getCommits(repoName, pullrequestid, response.next).then(commits => {
              resolve(commitsToValues(response).concat(commits));
            });
          } else {
            resolve(commitsToValues(response));
          }
        },
        error(ex) {
          reject(new Error(`failed due to ${ex.toString()}`));
        },
      });
    });
  });
}

export default function getChangesetsFromCommits(
  repoName /*: string */,
  pullrequestid /*: string */,
  urlNext? /*: string */,
) {
  return getCommits(repoName, pullrequestid, urlNext).then(commits =>
    commits
      .map(commit => commit.message)
      .filter(commit => !!commit.match(/^CHANGESET: .+?\n/))
      .map(parseChangesetCommit)
      // remove any changesets that couldn't be parsed
      .filter(changsetOrUndefined => !!changsetOrUndefined),
  );
}
