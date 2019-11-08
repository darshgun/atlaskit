import { ExtensionManifest, ExtensionProvider } from './types';

export default class DefaultExtensionProvider implements ExtensionProvider {
  private manifestsPromise: Promise<ExtensionManifest[]>;

  constructor(manifests: ExtensionManifest[] | Promise<ExtensionManifest[]>) {
    this.manifestsPromise = Promise.resolve(manifests);
  }

  async getExtension(key: string) {
    const extension = (await this.manifestsPromise).find(
      manifest => manifest.key === key,
    );

    if (!extension) {
      throw new Error(`Extension with key "${key}" not found!`);
    }

    return extension;
  }

  async getExtensions() {
    return await this.manifestsPromise;
  }

  async search(keyword: string) {
    const extensions = (await this.manifestsPromise).filter(manifest =>
      manifest.title.includes(keyword),
    );
    return extensions;
  }
}
