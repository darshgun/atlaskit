import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find useful to use in
integration/e2e tests available in media-picker:

- \`[data-test-id="media-picker-upload-button"]\`: Upload button that opens up native file picker
- \`[data-test-id="media-picker-insert-button"]\`: "Insert" button that closes media picker and give selected files to the consumer
- \`[data-test-id="media-picker-all-recents-media-card"]\`: A wrapper around media card in the list of recent files (includes all: freshly uploaded, and from previous sessions).
  Inside this element you can find two sub-types of card:
  - \`[data-test-id="media-picker-uploading-media-card"]\`: Card wrapper for a file that was just recentely (in current session) upload
  - \`[data-test-id="media-picker-recent-media-card"]\`: Card wrapper for a file that was uploaded in recent session
- \`[data-test-id="media-picker-recents-infinite-scroll"]\`: Element that contains all the cards in recents (and a dropzone) that can be scrolled
- \`[data-test-id="media-picker-file-input"]\`: \`<input type="file" />\` used to upload file from disk
- \`[data-test-id="media-picker-upload-menu-item"]\`: Button to switch to "Upload" section of popup media picker (default on open)
- \`[data-test-id="media-picker-giphy-menu-item"]\`: Button to switch to "Giphy" section of popup media picker
- \`[data-test-id="media-picker-dropbox-menu-item"]\`: Button to switch to "Dropbox" section of popup media picker
- \`[data-test-id="media-picker-google-menu-item"]\`: Button to switch to "Google Drive" section of popup media picker
`;
