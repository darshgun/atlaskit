import React from 'react';
import { ExtensionManifest } from '@atlaskit/editor-common';

const createFakeModule = (content: any) => () =>
  Promise.resolve({ default: content });

const createFakeManifest = (
  name: string,
  key: string,
  nodeKeys: string[],
): ExtensionManifest => ({
  name,
  key: `${key}-extension`,
  description: 'Jira results in a table',
  icon: {
    '16x16': createFakeModule({}),
  },
  capabilities: {
    quickinsert: nodeKeys.map(key => ({ key })),
    insertmenu: nodeKeys.map(key => ({ key })),
    node: nodeKeys.map(nodeKey => ({
      key: nodeKey,
      type: 'block',
      adf: createFakeModule({
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: nodeKey,
          text: `${name} - ${nodeKey} - demo`,
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
      }),
      render: createFakeModule(() => {
        return <div>My "{name}" extension</div>;
      }),
    })),
  },
});

export default createFakeManifest;
