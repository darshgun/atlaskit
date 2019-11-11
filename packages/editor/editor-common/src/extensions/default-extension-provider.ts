import {
  ExtensionManifest,
  ExtensionProvider,
  ExtensionType,
  ExtensionKey,
} from './types';

export default class DefaultExtensionProvider implements ExtensionProvider {
  private manifestsPromise: Promise<ExtensionManifest[]>;

  constructor(manifests: ExtensionManifest[] | Promise<ExtensionManifest[]>) {
    this.manifestsPromise = Promise.resolve(manifests);
  }

  async getExtension(type: ExtensionType, key: ExtensionKey) {
    const manifests = (await this.manifestsPromise).filter(
      manifest => manifest.type === type,
    );

    const extension = manifests.find(manifest =>
      manifest.modules.nodes.find(node => node.key === key),
    );

    if (!extension) {
      throw new Error(
        `Extension with type "${type}" and key "${key}" not found!`,
      );
    }

    return extension;
  }

  async getExtensions() {
    return await this.manifestsPromise;
  }

  async search(keyword: string) {
    const extensions = (await this.manifestsPromise).filter(manifest =>
      manifest.title.toLowerCase().includes(keyword.toLowerCase()),
    );
    return extensions;
  }
}
