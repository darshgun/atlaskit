import * as React from 'react';
import Loadable from 'react-loadable';
import {
  ExtensionProvider,
  combineProviders,
  getItemsFromModule,
  resolveImport,
} from '@atlaskit/editor-common';
import {
  QuickInsertProvider,
  QuickInsertItem,
} from '../plugins/quick-insert/types';

export async function extensionProviderToQuickInsertProvider(
  extensionProvider: ExtensionProvider,
): Promise<QuickInsertProvider> {
  const extensions = await extensionProvider.getExtensions();

  return {
    getItems: async () => {
      const quickInsertItems = getItemsFromModule<Promise<QuickInsertItem>>(
        extensions,
        'quickInsert',
        async item => {
          const Icon = Loadable<{ label: string }, any>({
            loader: item.icon,
            loading: () => null,
          });
          const node = resolveImport(await item.node.insert());

          return {
            title: item.title,
            description: item.description,
            icon: () => <Icon label={item.title} />,
            action: insert => insert(node),
          };
        },
      );

      return await Promise.all(quickInsertItems);
    },
  };
}

export function combineQuickInsertProviders(
  quickInsertProviders: Array<
    QuickInsertProvider | Promise<QuickInsertProvider>
  >,
): QuickInsertProvider {
  const { invokeList } = combineProviders<QuickInsertProvider>(
    quickInsertProviders,
  );

  return {
    getItems() {
      return invokeList('getItems');
    },
  };
}
