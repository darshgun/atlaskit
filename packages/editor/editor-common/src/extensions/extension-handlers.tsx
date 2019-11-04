import React from 'react';
import Loadable from 'react-loadable';

import {
  ExtensionProvider,
  ExtensionType,
  ExtensionKey,
  ExtensionParams,
  ExtensionHandlers,
} from './types';

export const getManifestNode = async (
  extensionProvider: ExtensionProvider,
  extensionType: ExtensionType,
  extensionKey: ExtensionKey,
) => {
  const manifest = await extensionProvider.getExtension(extensionType);

  if (!manifest) {
    throw new Error(`Extension with key "${extensionType}" not found!`);
  }

  const node = manifest.modules.nodes.find(node => node.key === extensionKey);

  if (!node) {
    throw new Error(
      `Node with key "${extensionKey}" not found on extension "${extensionType}"!`,
    );
  }

  return node;
};

export const getNodeRenderer = (
  extensionProvider: ExtensionProvider,
  extensionType: ExtensionType,
  extensionKey: ExtensionKey,
) => {
  return Loadable<{ extensionParams: ExtensionParams<{ text: string }> }, any>({
    loader: () => {
      return getManifestNode(
        extensionProvider,
        extensionType,
        extensionKey,
      ).then(node => node.render());
    },
    loading: () => null,
  });
};

// export const getExtensionHandlers = async (
//   extensionProvider: ExtensionProvider,
// ): Promise<ExtensionHandlers> => {
//   const manifests = await extensionProvider.getExtensions();

//   return manifests.reduce<ExtensionHandlers>((acc, extension) => {
//     return {
//       ...acc,
//       [extension.key]: (extensionParams: ExtensionParams<{ text: string }>) => {
//         const NodeRenderer = getNodeRenderer(
//           extensionProvider,
//           extension.key,
//           extensionParams.extensionKey,
//         );

//         return <NodeRenderer extensionParams={extensionParams} />;
//       },
//     };
//   }, {});
// };
