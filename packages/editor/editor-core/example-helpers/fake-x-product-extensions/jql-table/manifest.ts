import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  name: 'JQL table',
  key: 'jql-table-extension',
  description: 'Jira results in a table',
  icon: {},
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
        adf: async () => {
          return await import('./adf-node');
        },
        render: async () => {
          return await import('./extension-handler');
        },
      },
    ],
  },
};

export default manifest;
