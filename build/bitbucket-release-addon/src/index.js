import queryString from 'query-string';
import flattenChangesets from '@atlaskit/build-releases/version/flattenChangesets';
import yaml from 'js-yaml';

import getCommits from './get-commits';
import getChangesets from './get-changesets';
import { legacyChangesetRepos, v2ChangesetRepos } from './config';

const noChangesetMessage = `<div style="border: 2px solid red; padding: 10px; border-radius: 10px; display: inline-block;">
  <p><strong>Warning:</strong> No packages will be released with this PR</p>
  <p>If this was not intentional make sure you have run \`bolt changeset\` if you are trying to release packages.</p>
  <p>See <a href="https://bitbucket.org/atlassian/atlaskit-mk-2/src/HEAD/docs/guides/07-releasing-packages.md" target="_parent">this guide</a> for more details.</p>

</div>`;
const errorLoadingChangesetMessage = `<div style="color: red; border: 2px solid; padding: 10px; border-radius: 10px; display: inline-block;">
<p>Error loading changesets for this PR</p>
</div>`;

function releasesToHtmlList(releases) {
  return `<ul>
    ${releases.map(release => release.name).join(', ')}
  </ul>`;
}

const releasedPackagesMessage = (releases, v2) => {
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

  const dependentsWarningSection = v2
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

const yamlToReleases = changesets =>
  changesets
    .map(changeset => {
      const result = /\s*---([^]*?)\n\s*---\n([^]+)/.exec(changeset);
      const [, roughReleases] = result;
      const yamlStuff = yaml.safeLoad(roughReleases);
      return Object.entries(yamlStuff).map(([name, type]) => ({ name, type }));
    })
    .flat();

const {
  user,
  repo,
  pullrequestid,
  repoid,
  sourcehash,
  destinationhash,
} = queryString.parse(window.location.search);

// Only retrieve one type of changesets. Legacy commit changesets and v2 changesets (md files with yaml frontmatter)
// are only supported in repos defined in config.js
const legacy = legacyChangesetRepos.indexOf(repoid) >= 0;

const changesetInfoPromise = legacy
  ? Promise.resolve({ changesetPromise: getCommits(user, repo, pullrequestid) })
  : getChangesets(user, repo, sourcehash, destinationhash);

console.log(changesetInfoPromise);

changesetInfoPromise.then(({ changesetPromise, v2 = false }) =>
  changesetPromise
    .then(changesets => {
      if (!changesets || changesets.length === 0) {
        document.body.innerHTML = noChangesetMessage;
        return;
      }

      // Changesets will be in text form (from the markdown file) if V2
      // Otherwise in the JSON format that needs to be flattened
      const releases = v2
        ? yamlToReleases(changesets)
        : flattenChangesets(changesets);

      document.body.innerHTML = releasedPackagesMessage(releases, v2);
    })
    .catch(e => {
      console.error('error in changeset', e);
      document.body.innerHTML = errorLoadingChangesetMessage;
    }),
);
