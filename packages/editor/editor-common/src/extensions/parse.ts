import { ExtensionProvider, ExtensionManifest } from './types';
import { MenuItem, filterByCapability, groupBy } from './menu-helpers';
import combineProviders from './combine-extension-providers';
import { ADFEntity } from '@atlaskit/adf-utils';
import { EditorActions } from 'src';

type MenuItemMap = { [key: string]: MenuItem };

const groupMenuItemsByKey = (items: MenuItem[], keyPrefix: string) =>
  groupBy(items, 'key', key => `${keyPrefix}-${key}`);

const extractQuickInsertProvider = (extensions: ExtensionManifest[]) => {
  const quickInsertKeys = extensions.reduce<MenuItemMap>((acc, extension) => {
    const quickInsertItems = filterByCapability(extension, 'quickinsert');

    return {
      ...acc,
      ...groupMenuItemsByKey(quickInsertItems, extension.key),
    };
  }, {});

  const quickInsertMenuItems = Object.keys(quickInsertKeys).map(key => {
    const item = quickInsertKeys[key];
    return {
      title: item.title,
      icon: item.icon(),
      action: async (insert: (node: ADFEntity) => void) => {
        const node = (await item.node!.adf()).default;
        if (!node) {
          console.log('error, no item here');
        }
        return insert(node);
      },
    };
  });

  return { getItems: () => Promise.resolve(quickInsertMenuItems) };
};

const extractInsertMenuProvider = (extensions: ExtensionManifest[]) => {
  const insertMenuKeys = extensions.reduce<MenuItemMap>((acc, extension) => {
    const insertMenuItems = filterByCapability(extension, 'insertmenu');

    return {
      ...acc,
      ...groupMenuItemsByKey(insertMenuItems, extension.key),
    };
  }, {});

  const insertMenuMenuItems = Object.keys(insertMenuKeys).map(key => {
    const item = insertMenuKeys[key];
    return {
      content: item.title,
      value: { name: item.title },
      tooltipDescription: item.title,
      elemBefore: item.icon(),
      onClick: async (editorActions: EditorActions) => {
        const node = (await item.node!.adf()).default;
        if (!node) {
          console.log('error, no item here');
        }
        return editorActions.replaceDocument(node);
      },
    };
  });

  return { getItems: () => Promise.resolve(insertMenuMenuItems) };
};

/**
 * Will parse the providers and build a list of menu items for each extension point.
 */
export default async (
  extensionProviders: ExtensionProvider[],
): Promise<{
  extensionProvider: ExtensionProvider;
  quickInsertProvider: any;
  insertMenuProvider: any;
}> => {
  const combinedProviders = combineProviders(extensionProviders);

  const extensions = await combinedProviders.getExtensions();

  const quickInsertProvider = extractQuickInsertProvider(extensions);
  const insertMenuProvider = extractInsertMenuProvider(extensions);

  return {
    extensionProvider: combinedProviders,
    quickInsertProvider,
    insertMenuProvider,
  };
};
