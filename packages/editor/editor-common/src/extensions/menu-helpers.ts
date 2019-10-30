import { ExtensionManifest, MenuItem, Capability } from './types';

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
  key: string,
): MenuItem => ({
  key,
  title: manifest.name,
  icon: manifest.icon['16x16'],
  node: manifest.capabilities.node.find(node => node.key === key),
});

export const filterByCapability = (
  manifest: ExtensionManifest,
  capability: Capability,
): MenuItem[] => {
  const capabilities = manifest.capabilities[capability];
  return (capabilities || []).map((cap: any) =>
    buildMenuItem(manifest, cap.key),
  );
};
