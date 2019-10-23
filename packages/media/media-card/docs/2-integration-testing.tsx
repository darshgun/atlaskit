import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find useful to use in
integration/e2e tests available in media-card:

- \`[data-test-id="media-card-loading"]\`: Media Card in loading state (with a spinner in the middle and nothing else)
- \`[data-test-id="media-card-view"]\`: Non loading (resolved) Media Card
- \`[data-test-id="media-card-inline-player"]\`: Media Card with inline media player
- \`[data-test-id="media-file-card-view"]\`: This selector can be used to get some extra meta information via following attributes:
  - \`data-test-status\` will contain media card status - one from this list:
    - \`uploading\`
    - \`loading\`
    - \`processing\`
    - \`complete\`
    - \`error\`
    - \`failed-processing\`
  - \`data-test-progress\` will have a number (from 0 to 1) indication uploading progress
`;
