import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  title: 'Lorem ipsum',
  key: 'lorem-ipsum-extension',
  description: 'Inline extension demo',
  icons: {
    '16': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    quickInsert: [
      {
        key: 'lorem-ipsum-1',
        title: 'Lorem Ipsum 1',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        target: 'lorem-ipsum-1',
      },
      {
        key: 'two-paragraphs',
        title: 'Lorem Ipsum 2',
        icon: () => import('@atlaskit/icon/glyph/book'),
        target: 'lorem-ipsum-2',
      },
    ],
    insertMenu: [
      {
        key: 'lorem-ipsum-1',
        title: 'Lorem Ipsum 1',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        target: 'lorem-ipsum-1',
      },
      {
        key: 'lorem-ipsum-2',
        title: 'Lorem Ipsum 2',
        icon: () => import('@atlaskit/icon/glyph/book'),
        target: 'lorem-ipsum-2',
      },
    ],
    nodes: [
      {
        key: 'lorem-ipsum-1',
        type: 'inline',
        insert: () => import('./adf-node-text-1'),
        render: () => import('./extension-handler'),
      },
      {
        key: 'lorem-ipsum-2',
        type: 'inline',
        insert: () => import('./adf-node-text-2'),
        render: () => import('./extension-handler'),
      },
    ],
  },
};

export default manifest;
