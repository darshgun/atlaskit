import parseChangesetCommit from '@atlaskit/build-releases/changeset/parseChangesetCommit';

function commitsToValues(response) {
  return response.values;
}

function commitUrl(repoName, pullrequestid) {
  return `/2.0/repositories/${repoName}/pullrequests/${pullrequestid}/commits`;
}

function getCommits(repoName, pullrequestid, urlNext) {
  return new Promise((resolve, reject) => {
    window.AP.require('request', request => {
      request({
        url: urlNext || commitUrl(repoName, pullrequestid, urlNext),
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
          reject(`failed due to ${ex.toString()}`);
        },
      });
    });
  });
}

export default function getChangesetsFromCommits(repoName, pullrequestid) {
  return getCommits(repoName, pullrequestid).then(commits =>
    commits
      .map(commit => commit.message)
      .filter(commit => !!commit.match(/^CHANGESET: .+?\n/))
      .map(parseChangesetCommit)
      // remove any changesets that couldn't be parsed
      .filter(changsetOrUndefined => !!changsetOrUndefined),
  );
}
