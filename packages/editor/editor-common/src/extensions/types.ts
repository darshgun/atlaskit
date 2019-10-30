import { ADFEntity } from '@atlaskit/adf-utils';
import { ReactNode } from 'react';

export type AsyncESModule<T> = Promise<{
  default: T;
}>;

export type NodeRef = {
  key: string;
};

export type Node = {
  key: string;
  type: string;
  adf: () => AsyncESModule<ADFEntity>;
  render: () => AsyncESModule<ReactNode>;
};

export type ImagePath = string;

export type Icon = {
  [dimensions: string]: () => AsyncESModule<any>;
};

export type Capabilities = {
  quickinsert: NodeRef[];
  insertmenu: NodeRef[];
  node: Node[];
};

export type Capability = Exclude<keyof Capabilities, 'node'>;

export type ExtensionManifest = {
  key: string;
  name: string;
  description: string;
  icon: Icon;
  capabilities: Capabilities;
};

export type MenuItem = {
  key: string;
  title: string;
  icon: () => Promise<any>;
  node?: Node;
};

export type MenuItemMap = { [key: string]: MenuItem };

export interface ExtensionProvider {
  getExtensions(): Promise<ExtensionManifest[]>;
  getExtension(key: string): Promise<ExtensionManifest | undefined>;
  search(keyword: string): Promise<ExtensionManifest[]>;
}
