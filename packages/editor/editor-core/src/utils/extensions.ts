import { ExtensionProvider } from '@atlaskit/editor-common';
import {
  QuickInsertProvider,
  QuickInsertItem,
} from '../plugins/quick-insert/types';

export function extensionProviderToQuickInsertProvider(
  extensionProvider: ExtensionProvider,
): QuickInsertProvider {
  return {
    getItems: async () =>
      (await extensionProvider.getExtensions()).reduce(
        (acc: Array<QuickInsertItem>, extensionManifest) => {
          if (extensionManifest.modules.quickInsert) {
            return acc.concat(
              extensionManifest.modules.quickInsert.map<QuickInsertItem>(
                quickInsertModule => ({
                  title: quickInsertModule.title || extensionManifest.title,
                  description:
                    quickInsertModule.description ||
                    extensionManifest.description,
                  action: insert => insert({ type: 'extension' }),
                }),
              ),
            );
          }
          return acc;
        },
        [],
      ),
  };
}
