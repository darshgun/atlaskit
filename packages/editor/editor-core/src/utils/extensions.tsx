import * as React from 'react';
import Loadable from 'react-loadable';
import {
  ExtensionProvider,
  combineProviders,
  getItemsFromModule,
} from '@atlaskit/editor-common';
import {
  QuickInsertProvider,
  QuickInsertItem,
} from '../plugins/quick-insert/types';
import { InsertMenuCustomItem } from '../types';
import EditorActions from '../actions';

export async function extractItemsFromExtensionProvider(
  extensionProvider: ExtensionProvider,
): Promise<InsertMenuCustomItem[]> {
  const extensions = await extensionProvider.getExtensions();

  const insertMenuItems = getItemsFromModule<Promise<InsertMenuCustomItem>>(
    extensions,
    'insertMenu',
    async item => {
      const Icon = Loadable<{ label: string }, any>({
        loader: item.icon,
        loading: () => null,
      });

      return {
        content: item.title,
        value: { name: item.title },
        tooltipDescription: item.description,
        elemBefore: <Icon label={item.title} />,
        onClick: async (editorActions: EditorActions) => {
          const node = item.node && (await item.node.insert()).default;
          if (!node) {
            console.error('no node available');
            return;
          }
          return editorActions.replaceSelection(node);
        },
      };
    },
  );

  return await Promise.all(insertMenuItems);
}

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
          const node = (await item.node.insert()).default;

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
