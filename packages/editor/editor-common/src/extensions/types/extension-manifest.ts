import { ADFEntity } from '@atlaskit/adf-utils';
import { ReactNode } from 'react';

export type ExtensionType = string;

export type ExtensionKey = string;

export type ExtensionModuleKey = string;

export type Icon = () => Promise<any>;

export type Icons = {
  [dimensions: string]: Icon;
};

export type ExtensionNodeType =
  | 'extension'
  | 'inlineExtension'
  | 'bodiedExtension';

export type ExtensionManifest = {
  type: ExtensionType;
  key: ExtensionKey;
  title: string;
  description: string;
  icons: Icons;
  modules: ExtensionModules;
};

export type ExtensionModules = {
  quickInsert?: ExtensionModule[];
  nodes: ExtensionModuleNodes;
};

export type ExtensionModuleAction =
  | ExtensionModuleActionObject
  | ExtensionModuleActionHandler;

export type ExtensionModuleActionObject = {
  key: ExtensionModuleKey;
  type: 'node';
  parameters: any;
};

export type ExtensionModuleActionHandler = () => AsyncESModule<ADFEntity>;

export type ExtensionModule = {
  key: string;
  title?: string;
  description?: string;
  icon?: Icon;
  priority?: number;
  keywords?: Array<string>;
  action: ExtensionModuleAction;
};

export type ExtensionModuleNodes = {
  [key: string]: ExtensionModuleNode;
};

export type ExtensionModuleNode = {
  type: ExtensionNodeType;
  render: () => AsyncESModule<ReactNode>;
};

export type ExtensionModuleType = Exclude<keyof ExtensionModules, 'nodes'>;

export type ESModule<T> = {
  __esModule?: boolean;
  default: T;
};

export type Module<T> = ESModule<T> | T;

export type AsyncESModule<T> = Promise<Module<T>>;

export type MaybeADFEntity = AsyncESModule<ADFEntity | undefined>;
