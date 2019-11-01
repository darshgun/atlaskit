import { ExtensionManifest, ExtensionProvider } from './types';

export default class DefaultExtensionProvider implements ExtensionProvider {
  private manifests: ExtensionManifest[] | Promise<ExtensionManifest[]>;

  constructor(manifests: ExtensionManifest[] | Promise<ExtensionManifest[]>) {
    this.manifests = manifests;
  }

  private async getManifests(): Promise<ExtensionManifest[]> {
    return Promise.resolve(this.manifests);
  }

  async getExtension(key: string) {
    const extension = (await this.getManifests()).find(
      manifest => manifest.key === key,
    );
    return extension;
  }

  async getExtensions() {
    return await this.getManifests();
  }

  async search(keyword: string) {
    const extensions = (await this.getManifests()).filter(manifest =>
      manifest.title.includes(keyword),
    );
    return extensions;
  }
}
