import { ExtensionProvider } from './types';
import {
  MenuItem,
  filterByCapability,
  runInAllExtensionProviders,
  groupBy,
  flatten,
} from './helpers';

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

export default async (extensionProviders: ExtensionProvider[]) => {
  const extensionsResult = flatten(
    await Promise.all(
      extensionProviders.map(async provider => provider.getExtensions()),
    ),
  );

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
    actions: runInAllExtensionProviders(extensionProviders),
  };
};
