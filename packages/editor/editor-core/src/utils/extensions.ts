import { ExtensionProvider } from '@atlaskit/editor-common';
import {
  QuickInsertProvider,
  QuickInsertItem,
} from '../plugins/quick-insert/types';

export function getI18nValue(str: i18nString) {
  return typeof str === 'string' ? str : str.value;
}

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
                  title: getI18nValue(quickInsertModule.title),
                  description: getI18nValue(quickInsertModule.description),
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
