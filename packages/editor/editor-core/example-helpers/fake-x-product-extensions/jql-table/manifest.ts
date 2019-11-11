import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  title: 'Jira',
  type: 'fancy.extensions',
  key: 'jira',
  description: 'Jira results in a table',
  icons: {
    '16': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    quickInsert: [
      {
        key: 'jql-table',
        icon: () => import('@atlaskit/icon/glyph/table'),
        target: 'jql-table',
      },
    ],
    insertMenu: [
      {
        key: 'jql-table',
        icon: () => import('@atlaskit/icon/glyph/table'),
        description: 'Insert a table with results from a JQL query',
        target: 'jql-table',
      },
    ],
    nodes: [
      {
        key: 'jql-table',
        insert: () => import('./adf-node'),
        render: () => import('./extension-handler'),
      },
    ],
  },
};

export default manifest;
