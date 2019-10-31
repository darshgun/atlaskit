import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  title: 'Loren ipsum',
  key: 'loren-ipsum-extension',
  description: 'Inline extension demo',
  icon: {
    '16x16': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  capabilities: {
    quickinsert: [
      {
        key: 'loren-ipsum-1',
        title: 'Loren Ipsum 1',
        icon: {
          '16x16': () => import('@atlaskit/icon/glyph/tray'),
        },
      },
      {
        key: 'two-paragraphs',
        title: 'Loren Ipsum 2',
        icon: {
          '16x16': () => import('@atlaskit/icon/glyph/book'),
        },
      },
    ],
    insertmenu: [
      {
        key: 'loren-ipsum-1',
        title: 'Loren Ipsum 1',
        icon: {
          '16x16': () => import('@atlaskit/icon/glyph/tray'),
        },
      },
      {
        key: 'loren-ipsum-2',
        title: 'Loren Ipsum 2',
        icon: {
          '16x16': () => import('@atlaskit/icon/glyph/book'),
        },
      },
    ],
    node: [
      {
        key: 'loren-ipsum-1',
        type: 'inline',
        adf: () => import('./adf-node-text-1'),
        render: () => import('./extension-handler'),
      },
      {
        key: 'loren-ipsum-2',
        type: 'inline',
        adf: () => import('./adf-node-text-2'),
        render: () => import('./extension-handler'),
      },
    ],
  },
};

export default manifest;
