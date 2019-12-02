import {
  inlineExtension,
  extension,
  bodiedExtension,
} from '@atlaskit/adf-schema';
import { ExtensionHandlers } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import createPlugin from './plugin';
import { getToolbarConfig } from './toolbar';

interface ExtensionPluginOptions {
  breakoutEnabled?: boolean;
  stickToolbarToBottom?: boolean;
  extensionHandlers?: ExtensionHandlers;
}

const extensionPlugin = (options?: ExtensionPluginOptions): EditorPlugin => ({
  name: 'extension',

  nodes() {
    return [
      { name: 'extension', node: extension },
      { name: 'bodiedExtension', node: bodiedExtension },
      { name: 'inlineExtension', node: inlineExtension },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'extension',
        plugin: ({ dispatch, providerFactory, portalProviderAPI }) => {
          const allowBreakout = options && options.breakoutEnabled;
          const stickToolbarToBottom = options && options.stickToolbarToBottom;
          const extensionHandlers = options && options.extensionHandlers;

          return createPlugin(
            dispatch,
            providerFactory,
            extensionHandlers || {},
            portalProviderAPI,
            stickToolbarToBottom,
            allowBreakout,
          );
        },
      },
    ];
  },

  pluginsOptions: {
    floatingToolbar: getToolbarConfig(options && options.breakoutEnabled),
  },
});

export default extensionPlugin;
