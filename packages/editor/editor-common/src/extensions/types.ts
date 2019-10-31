import { ADFEntity } from '@atlaskit/adf-utils';
import { ReactNode } from 'react';

export type ExtensionManifest = {
  key: string;
  title: string;
  description: string;
  icon: Icon;
  capabilities: Capabilities;
};

export type Icon = {
  [dimensions: string]: () => Promise<any>;
};

export type Capabilities = {
  quickinsert: Capability[];
  insertmenu: Capability[];
  node: Node[];
};

export type Capability = {
  key: string;
  title?: string;
  description?: string;
  icon?: Icon;
};

export type Node = {
  key: string;
  type: string;
  adf: () => AsyncESModule<ADFEntity>;
  render: () => AsyncESModule<ReactNode>;
};

export type CapabilityType = Exclude<keyof Capabilities, 'node'>;

export type AsyncESModule<T> = Promise<{
  default: T;
}>;

export type MenuItem = {
  key: string;
  title: string;
  description: string;
  icon: () => Promise<any>;
  node: Node;
};

export type MenuItemMap = { [key: string]: MenuItem };

export interface ExtensionProvider {
  getExtensions(): Promise<ExtensionManifest[]>;
  getExtension(key: string): Promise<ExtensionManifest | undefined>;
  search(keyword: string): Promise<ExtensionManifest[]>;
}
