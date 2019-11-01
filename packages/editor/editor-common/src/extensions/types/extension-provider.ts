import { ExtensionManifest } from './extension-manifest';

export interface ExtensionProvider {
  getExtensions(): Promise<ExtensionManifest[]>;
  getExtension(key: string): Promise<ExtensionManifest>;
  search(keyword: string): Promise<ExtensionManifest[]>;
}
