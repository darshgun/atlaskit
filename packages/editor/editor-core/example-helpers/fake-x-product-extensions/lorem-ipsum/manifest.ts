import { ExtensionManifest } from '@atlaskit/editor-common';

const manifest: ExtensionManifest = {
  title: 'Lorem ipsum',
  type: 'com.atlassian.connect',
  key: 'fake.lorem.ipsum',
  description: 'Inline extension demo',
  icons: {
    '16': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    quickInsert: [
      {
        key: 'qi-lorem-ipsum-1',
        title: 'Lorem Ipsum 1',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        target: 'lorem-ipsum-1',
      },
      {
        key: 'qi-lorem-ipsum-2',
        title: 'Lorem Ipsum 2',
        icon: () => import('@atlaskit/icon/glyph/book'),
        target: 'lorem-ipsum-2',
      },
      {
        key: 'qi-lorem-ipsum-3',
        title: 'Lorem Ipsum 3 with body',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        target: 'lorem-ipsum-3-with-body',
      },
      {
        key: 'qi-lorem-ipsum-4',
        title: 'Lorem Ipsum 4 inline',
        icon: () => import('@atlaskit/icon/glyph/bitbucket/pipelines'),
        target: 'lorem-ipsum-4-inline',
      },
    ],
    nodes: {
      'lorem-ipsum-1': {
        insert: () => import('./adf-node-text-1'),
        render: () => import('./extension-handler'),
      },
      'lorem-ipsum-2': {
        insert: () => import('./adf-node-text-2'),
        render: () => import('./extension-handler'),
      },
      'lorem-ipsum-3-with-body': {
        insert: () => import('./adf-node-text-3-with-body'),
        render: () => import('./extension-handler'),
      },
      'lorem-ipsum-4-inline': {
        insert: () => import('./adf-node-text-4-inline'),
        render: () => import('./extension-handler'),
      },
    },
  },
};

export default manifest;
