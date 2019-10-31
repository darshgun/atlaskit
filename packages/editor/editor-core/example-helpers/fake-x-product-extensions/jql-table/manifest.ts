import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  title: 'JQL table',
  key: 'jql-table-extension',
  description: 'Jira results in a table',
  icon: {
    '16x16': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  capabilities: {
    quickinsert: [
      {
        key: 'jql-table',
        icon: {
          '16x16': () => import('@atlaskit/icon/glyph/table'),
        },
      },
    ],
    insertmenu: [
      {
        key: 'jql-table',
        icon: {
          '16x16': () => import('@atlaskit/icon/glyph/table'),
        },
        description: 'Insert a table with results from a JQL query',
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
