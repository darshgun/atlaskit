import {
  ExtensionManifest,
  MenuItem,
  Capability,
  CapabilityType,
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
  capability: Capability,
): MenuItem => ({
  key: capability.key,
  title: capability.title || manifest.title,
  description: capability.description || manifest.description,
  icon: (capability.icon || manifest.icon)['16x16'],
  node: manifest.capabilities.node.find(node => node.key === capability.key),
});

export const filterByCapability = (
  manifest: ExtensionManifest,
  capability: CapabilityType,
): MenuItem[] => {
  const capabilities = manifest.capabilities[capability];

  return (capabilities || []).map((capability: any) =>
    buildMenuItem(manifest, capability),
  );
};

const getGroupedMenuItems = (
  extensions: ExtensionManifest[],
  capability: CapabilityType,
): MenuItemMap => {
  return extensions.reduce<MenuItemMap>((acc, extension) => {
    const items = filterByCapability(extension, capability);

    return {
      ...acc,
      ...groupBy(items, 'key', key => `${extension.key}-${key}`),
    };
  }, {});
};

export const getItemsFromCapability = <T>(
  extensions: ExtensionManifest[],
  capability: CapabilityType,
  transformFunction: (value: MenuItem, index: number) => T,
): T[] => {
  const groupedMenuItems = getGroupedMenuItems(extensions, capability);
  return Object.keys(groupedMenuItems).map((key, index) =>
    transformFunction(groupedMenuItems[key], index),
  );
};
