import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find useful to use in
integration/e2e tests available in media-viewer:

- \`[data-test-id="media-viewer-popup"]\`: Main Media Viewer element
- \`[data-test-id="media-viewer-close-button"]\`: Close button
- \`[data-test-id="media-viewer-download-button"]\`: Download button
- \`[data-test-id="media-viewer-navigation-left"]\`: Navigation left button
- \`[data-test-id="media-viewer-navigation-right"]\`: Navigation right button
- \`[data-test-id="media-viewer-error"]\`: When media viewer can't show preview of a file, this component present
- \`[data-test-id="media-viewer-pdf-content"]\`: Content element for PDF document
- \`[data-test-id="media-viewer-image-content"]\`: Content element for image document
  - \`[data-test-id="media-viewer-image"]\`: \`<img />\` with image itself. Can be found inside 'media-viewer-image-content'
- \`[data-test-id="media-viewer-audio-content"]\`: Content element for audio document
- \`[data-test-id="media-viewer-video-content"]\`: Content element for video document
- These controls can be found as part of media players:
  - \`[data-test-id="custom-media-player-fullscreen-button"]\`: Fullscreen button
  - \`[data-test-id="custom-media-player-download-button"]\`: Download button
  - \`[data-test-id="custom-media-player-play-toggle-button"]\`: Pause/Pause button
  - \`[data-test-is-playing="data-test-is-playing"]\`: Contains 'true' if it media is playing and 'false' otherwise.
`;
