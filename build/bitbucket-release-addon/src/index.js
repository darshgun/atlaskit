// @flow
import queryString from 'query-string';
import flattenChangesets from '@atlaskit/build-utils/flattenReleases';
import yaml from 'js-yaml';

import getChangesetsFromCommits from './get-commits';
import getChangesetsFromFiles from './get-changesets';
import { legacyChangesetRepos } from './config';

const noChangesetMessage = `<div style="border: 2px solid red; padding: 10px; border-radius: 10px; display: inline-block;">
  <p><strong>Warning:</strong> No packages will be released with this PR</p>
  <p>It is now a requirement that all PRs <strong>must</strong> include a changeset.</p>
  <p>Run \`yarn changeset\` to create one, or \`yarn changeset:empty\` to create an empty one that releases nothing.</p>
  <p>See <a href="https://bitbucket.org/atlassian/atlaskit-mk-2/src/HEAD/docs/guides/07-releasing-packages.md" target="_parent">this guide</a> for more details.</p>
</div>`;

const noReleaseEmtpyChangesetMessage = `<div style="border: 2px solid red; padding: 10px; border-radius: 10px; display: inline-block;">
  <p><strong>Warning:</strong> No packages will be released with this PR because an empty changeset exists</p>
  <p>If this is a mistake, please delete the empty changeset and run \`yarn changeset\` again</p>
</div>`;
const errorLoadingChangesetMessage = `<div style="color: red; border: 2px solid; padding: 10px; border-radius: 10px; display: inline-block;">
<p>Error loading changesets for this PR</p>
</div>`;

function releasesToHtmlList(releases) {
  return `<ul>
    ${releases.map(release => release.name).join(', ')}
  </ul>`;
}

const releasedPackagesMessage = (releases, shouldWarnAboutChangesetsV2) => {
  const majorReleases = releases.filter(release => release.type === 'major');
  const minorReleases = releases.filter(release => release.type === 'minor');
  const patchReleases = releases.filter(release => release.type === 'patch');

  const majorReleasesSection =
    majorReleases.length > 0
      ? `<h3>💥 Major Releases</h3>${releasesToHtmlList(majorReleases)}`
      : '';
  const minorReleasesSection =
    minorReleases.length > 0
      ? `<h3>✨ Minor Releases</h3>${releasesToHtmlList(minorReleases)}`
      : '';
  const patchReleasesSection =
    patchReleases.length > 0
      ? `<h3>🛠 Patch Releases</h3>${releasesToHtmlList(patchReleases)}`
      : '';

  const dependentsWarningSection = shouldWarnAboutChangesetsV2
    ? `<p style="color: red;">Warning: Dependents can not currently be displayed by the Release Addon when using Changesets V2.<br>
         <text style="color: rgb(80, 95, 121)">You can check these manually by running <strong>yarn changeset status</strong> in your terminal.</text></p>
         <p style="color: rgb(80, 95, 121)">For any questions, please see the <strong>#atlaskit-build</strong> room.</p>`
    : '';

  return `<div style="color: green; border: 1px solid; padding: 10px; border-radius: 10px; display: inline-block;">
    ${majorReleasesSection}
    ${minorReleasesSection}
    ${patchReleasesSection}
    ${dependentsWarningSection}
  </div>`;
};

const yamlToReleases = changesets => {
  if (!changesets || changesets.length === 0) return [];
  return changesets
    .map(changeset => {
      const lines = changeset.split('\n');
      let yamlStr = '';
      if (lines[0] !== '---') return null; // if we don't have a frontmatter block, skip this file
      let lineIdx = 1; // skip the first line, we know it is '---'
      while (lines[lineIdx] !== '---') {
        yamlStr += lines[lineIdx];
        lineIdx += 1;
      }
      if (yamlStr.length === 0) return [];
      const yamlObj = yaml.safeLoad(yamlStr);
      return Object.entries(yamlObj).map(([name, type]) => ({ name, type }));
    })
    .filter(Boolean)
    .flat();
};

const {
  repoName, // repoName is the full repo path (i.e atlassian/atlaskit-mk-2)
  pullrequestid,
  sourcehash,
  destinationhash,
  repoid,
} = queryString.parse(window.location.search);

async function main() {
  // Only retrieve one type of changesets. Legacy commit changesets
  // are only supported in repos defined in config.js
  const legacy = legacyChangesetRepos.indexOf(repoid) >= 0;

  const releases = [];
  let changesetsPresent = false;
  let shouldWarnAboutChangesetsV2 = false;
  if (legacy) {
    const changesets = await getChangesetsFromCommits(repoName, pullrequestid);
    releases.push(...flattenChangesets(changesets));
  } else {
    const { v1changesets, v2changesets } = await getChangesetsFromFiles(
      repoName,
      sourcehash,
      destinationhash,
    );
    if (v1changesets.length) {
      releases.push(...flattenChangesets(v1changesets));
    }
    if (v2changesets.length) {
      shouldWarnAboutChangesetsV2 = true;
      releases.push(...yamlToReleases(v2changesets));
    }
    if (v1changesets.length + v2changesets.length > 0) {
      changesetsPresent = true;
    }
  }

  if (releases.length === 0) {
    if (changesetsPresent) {
      // $FlowFixMe - document.body.innerHTML does not exist in noReleaseEmtpyChangesetMessage.
      document.body.innerHTML = noReleaseEmtpyChangesetMessage;
    } else {
      // $FlowFixMe - document.body.innerHTML does not exist in noReleaseEmtpyChangesetMessage.
      document.body.innerHTML = noChangesetMessage;
    }
    return;
  }
  // $FlowFixMe - document.body.innerHTML does not exist in noReleaseEmtpyChangesetMessage.
  document.body.innerHTML = releasedPackagesMessage(
    releases,
    shouldWarnAboutChangesetsV2,
  );
}

try {
  main();
} catch (e) {
  console.error('error in changeset', e);
  // $FlowFixMe - document.body.innerHTML does not exist in noReleaseEmtpyChangesetMessage.
  document.body.innerHTML = errorLoadingChangesetMessage;
}
