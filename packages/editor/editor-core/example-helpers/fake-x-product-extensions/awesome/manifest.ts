import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  title: 'My awesome extension',
  type: 'com.atlassian.forge',
  key: 'awesome',
  description: 'Extension that does awesome things',
  icons: {
    '16': () => import('@atlaskit/icon/glyph/tray'),
    '24': () => import('@atlaskit/icon/glyph/tray'),
    '32': () => import('@atlaskit/icon/glyph/tray'),
  },
  modules: {
    quickInsert: [
      {
        key: 'item',
        title: 'Awesome item',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        action: {
          type: 'node',
          key: 'default',
          parameters: {
            item: 'a',
          },
        },
      },
      {
        key: 'list',
        title: 'Awesome list',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        action: {
          type: 'node',
          key: 'list',
          parameters: {
            items: ['a', 'b', 'c', 'd'],
          },
        },
      },
    ],
    nodes: {
      default: {
        type: 'extension',
        render: () => import('./extension-handler'),
      },
      list: {
        type: 'extension',
        render: () => import('./extension-handler'),
      },
    },
  },
};

export default manifest;
