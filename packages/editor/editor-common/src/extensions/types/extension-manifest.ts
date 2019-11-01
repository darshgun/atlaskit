import { ADFEntity } from '@atlaskit/adf-utils';
import { ReactNode } from 'react';

type ModuleKey = string;

export type Icon = () => Promise<any>;

export type Icons = {
  [dimensions: string]: Icon;
};

export type ExtensionManifest = {
  key: string;
  title: string;
  description: string;
  icons: Icons;
  modules: ExtensionModules;
};

export type ExtensionModules = {
  quickInsert?: ExtensionModule[];
  insertMenu?: ExtensionModule[];
  nodes: ExtensionNode[];
};

export type ExtensionModule = {
  key: string;
  title?: string;
  description?: string;
  icon?: Icon;
  priority?: number;
  keywords?: Array<string>;
  target: ModuleKey;
};

export type ExtensionNode = {
  key: string;
  type: string;
  insert: () => AsyncESModule<ADFEntity>;
  render: () => AsyncESModule<ReactNode>;
};

export type ExtensionModuleType = Exclude<keyof ExtensionModules, 'nodes'>;

export type AsyncESModule<T> = Promise<{
  default: T;
}>;
