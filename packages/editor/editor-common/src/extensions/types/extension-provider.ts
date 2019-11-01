import { ExtensionManifest } from './extension-manifest';

export interface ExtensionProvider {
  getExtensions(): Promise<ExtensionManifest[]>;
  getExtension(key: string): Promise<ExtensionManifest | undefined>;
  search(keyword: string): Promise<ExtensionManifest[]>;
}
