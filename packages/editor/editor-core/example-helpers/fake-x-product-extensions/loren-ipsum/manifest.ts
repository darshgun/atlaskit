import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  name: 'Loren ipsum',
  key: 'loren-ipsum-extension',
  description: 'Inline extension demo',
  icon: {
    '16x16': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  capabilities: {
    quickinsert: [
      {
        key: 'loren-ipsum',
      },
    ],
    insertmenu: [
      {
        key: 'loren-ipsum',
      },
    ],
    node: [
      {
        key: 'loren-ipsum',
        type: 'inline',
        adf: () => import('./adf-node'),
        render: () => import('./extension-handler'),
      },
    ],
  },
};

export default manifest;
