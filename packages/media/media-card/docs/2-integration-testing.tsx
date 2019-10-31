import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find useful to use in
integration/e2e tests available in media-card:

- \`[data-testid="media-card-loading"]\`: Media Card in loading state (with a spinner in the middle and nothing else)
- \`[data-testid="media-card-view"]\`: Non loading (resolved) Media Card
- \`[data-testid="media-card-inline-player"]\`: Media Card with inline media player
- \`[data-testid="media-file-card-view"]\`: This selector can be used to get some extra meta information via following attributes:
  - \`data-test-status\` will contain media card status - one from this list:
    - \`uploading\`
    - \`loading\`
    - \`processing\`
    - \`complete\`
    - \`error\`
    - \`failed-processing\`
  - \`data-test-progress\` will have a number (from 0 to 1) indication uploading progress
  - \`data-test-selected\` will be present if card is selected
- \`[data-testid="media-card-retry-button"]\`: Retry button
- \`[data-testid="media-card-primary-action"]\`: Primary action button (there could be two of them max)
- \`[data-testid="media-card-actions-menu"]\`: Actions menu button (three dots icon) that open dropdown
- \`[data-testid="media-card-actions-menu-item"]\`: Action dropdown item
- \`[data-testid="media-image"]\`: Actual image (\`<img />\`) of a card
- These controls can be found as part of Card's inline media player:
  - \`[data-testid="custom-media-player-fullscreen-button"]\`: Fullscreen button
  - \`[data-testid="custom-media-player-download-button"]\`: Download button
  - \`[data-testid="custom-media-player-play-toggle-button"]\`: Pause/Pause button
  - \`[data-test-is-playing="data-test-is-playing"]\`: Contains 'true' if it media is playing and 'false' otherwise.
`;
