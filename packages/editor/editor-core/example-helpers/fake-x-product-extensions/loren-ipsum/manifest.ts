import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  name: 'Loren ipsum',
  key: 'loren-ipsum-extension',
  description: 'Inline extension demo',
  icon: {},
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
