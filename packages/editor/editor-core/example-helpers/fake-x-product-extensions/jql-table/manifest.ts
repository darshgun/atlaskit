import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  name: 'JQL table',
  key: 'jql-table-extension',
  description: 'Jira results in a table',
  icon: {
    '16x16': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  capabilities: {
    quickinsert: [
      {
        key: 'jql-table',
      },
    ],
    insertmenu: [
      {
        key: 'jql-table',
      },
    ],
    node: [
      {
        key: 'jql-table',
        type: 'block',
        adf: () => import('./adf-node'),
        render: () => import('./extension-handler'),
      },
    ],
  },
};

export default manifest;
