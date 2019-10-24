import { ExtensionManifest, ExtensionProvider, Capability } from './types';

export type MenuItem = {
  key: string;
  title: string;
  node?: ExtensionManifest['capabilities']['node'];
};

const flatten = <T>(arr: T[][]): T[] => ([] as any).concat(...arr);

export const groupBy = <T>(
  arr: T[],
  attr: keyof T,
): {
  [k: string]: T;
} =>
  arr.reduce<any>((acc, item) => {
    acc[item[attr]] = item;
    return acc;
  }, {});

export const buildMenuItem = (
  manifest: ExtensionManifest,
  key: string,
): MenuItem => ({
  key,
  title: manifest.name,
  node: manifest.capabilities.node,
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

export const runInAllExtensionProviders = (
  extensionProviders: ExtensionProvider[],
): ExtensionProvider => ({
  async getExtensions() {
    const result = await Promise.all(
      extensionProviders.map(provider => provider.getExtensions()),
    );
    return flatten(result);
  },

  async getExtension(key: string) {
    const result = await Promise.all(
      extensionProviders.map(provider => provider.getExtension(key)),
    );
    return result.find(extension => extension);
  },

  async search(keyword: string) {
    const result = await Promise.all(
      extensionProviders.map(provider => provider.search(keyword)),
    );
    return flatten(result).filter(extension => extension);
  },
});
