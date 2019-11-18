import {
  ExtensionManifest,
  MenuItem,
  ExtensionModule,
  ExtensionModuleType,
  MenuItemMap,
} from './types';

export const groupBy = <T>(
  arr: T[],
  attr: keyof T,
  keyRenamer: (key: T[keyof T]) => string,
): {
  [k: string]: T;
} =>
  arr.reduce<any>((acc, item) => {
    acc[keyRenamer(item[attr])] = item;
    return acc;
  }, {});

export const buildMenuItem = (
  manifest: ExtensionManifest,
  extensionModule: ExtensionModule,
): MenuItem => {
  const node = manifest.modules.nodes[extensionModule.target];

  if (!node) {
    throw new Error(
      `The node "${extensionModule.key}" was not found on extension "${manifest.key}"`,
    );
  }
  return {
    key: `${manifest.key}:${extensionModule.key}`,
    title: extensionModule.title || manifest.title,
    description: extensionModule.description || manifest.description,
    icon: extensionModule.icon || manifest.icons['48'],
    node,
  };
};

export const filterByModule = (
  manifest: ExtensionManifest,
  moduleType: ExtensionModuleType,
): MenuItem[] => {
  const modules = manifest.modules[moduleType];

  return (modules || []).map((extensionModule: any) =>
    buildMenuItem(manifest, extensionModule),
  );
};

const getGroupedMenuItems = (
  extensions: ExtensionManifest[],
  moduleType: ExtensionModuleType,
): MenuItemMap => {
  return extensions.reduce<MenuItemMap>((acc, extension) => {
    const items = filterByModule(extension, moduleType);

    return {
      ...acc,
      ...groupBy(items, 'key', key => key as string),
    };
  }, {});
};

export const getItemsFromModule = <T>(
  extensions: ExtensionManifest[],
  moduleType: ExtensionModuleType,
  transformFunction: (value: MenuItem, index: number) => T,
): T[] => {
  const groupedMenuItems = getGroupedMenuItems(extensions, moduleType);
  return Object.keys(groupedMenuItems).map((key, index) => {
    console.log(key, groupedMenuItems[key]);
    return transformFunction(groupedMenuItems[key], index);
  });
};
