import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find useful to use in
integration/e2e tests available in media-ui. These components are most likely be met as part of other media components.

These elements will be found in inline media player and media player as part of media viewer:

- \`[data-test-id="custom-media-player-fullscreen-button"]\`: Fullscreen button
- \`[data-test-id="custom-media-player-download-button"]\`: Download button
- \`[data-test-id="custom-media-player-pause-button"]\`: Pause button
- \`[data-test-id="custom-media-player-play-button"]\`: Play button
`;
