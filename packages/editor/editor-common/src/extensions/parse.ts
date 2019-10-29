import { ExtensionProvider } from './types';
import { MenuItem, filterByCapability, groupBy } from './menu-helpers';
import combineProviders from './combine-extension-providers';

type MappedExtensionPoints = {
  quickInsert: { [key: string]: MenuItem };
  insertMenu: { [key: string]: MenuItem };
};

const extensionsPoints: MappedExtensionPoints = {
  quickInsert: {} as never,
  insertMenu: {} as never,
};

const groupMenuItemsByKey = (items: MenuItem[], keyPrefix: string) =>
  groupBy(items, 'key', key => `${keyPrefix}-${key}`);

/**
 * Will parse the providers and build a list of menu items for each extension point.
 */
export default async (
  extensionProviders: ExtensionProvider[],
): Promise<{
  extensionsPoints: MappedExtensionPoints;
  provider: ExtensionProvider;
}> => {
  const combinedProviders = combineProviders(extensionProviders);

  const extensionsResult = await combinedProviders.getExtensions();

  extensionsResult.forEach(extension => {
    const quickInsertItems = filterByCapability(extension, 'quickinsert');

    Object.assign(
      extensionsPoints.quickInsert,
      groupMenuItemsByKey(quickInsertItems, extension.key),
    );

    const insertMenuItems = filterByCapability(extension, 'insertmenu');

    Object.assign(
      extensionsPoints.insertMenu,
      groupMenuItemsByKey(insertMenuItems, extension.key),
    );
  });

  return {
    extensionsPoints,
    provider: combinedProviders,
  };
};
