import { ExtensionManifest, MenuItem, MenuItemMap } from './types';
import { filterByCapability, groupBy } from './menu-helpers';
import { ADFEntity } from '@atlaskit/adf-utils';

const groupMenuItemsByKey = (items: MenuItem[], keyPrefix: string) =>
  groupBy(items, 'key', key => `${keyPrefix}-${key}`);

export const extractQuickInsertProvider = (extensions: ExtensionManifest[]) => {
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
