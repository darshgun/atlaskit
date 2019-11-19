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
        target: 'default',
      },
      {
        key: 'list',
        title: 'Awesome list',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        target: 'list',
      },
    ],
    nodes: {
      default: {
        insert: () =>
          Promise.resolve({
            type: 'inlineExtension',
            attrs: {
              extensionType: 'com.atlassian.forge',
              extensionKey: 'awesome',
              parameters: {
                item: 'a',
              },
            },
          }),
        render: () => import('./extension-handler'),
      },
      list: {
        insert: () =>
          Promise.resolve({
            type: 'extension',
            attrs: {
              extensionType: 'com.atlassian.forge',
              extensionKey: 'awesome:list',
              parameters: {
                items: ['a', 'b', 'c', 'd'],
              },
            },
          }),
        render: () => import('./extension-handler'),
      },
    },
  },
};

export default manifest;
