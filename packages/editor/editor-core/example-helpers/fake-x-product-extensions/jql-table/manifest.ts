import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  title: 'Jira',
  type: 'com.atlassian.confluence.macro.core',
  key: 'jql-table',
  description: 'Jira results in a table',
  icons: {
    '16': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    quickInsert: [
      {
        key: 'jql-table',
        icon: () => import('@atlaskit/icon/glyph/table'),
        action: {
          type: 'node',
          key: 'default',
          parameters: {
            macroParams: {},
            macroMetadata: {
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      },
    ],
    nodes: {
      default: {
        type: 'extension',
        render: () => import('./extension-handler'),
      },
    },
  },
};

export default manifest;
