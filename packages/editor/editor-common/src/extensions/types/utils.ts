import { ExtensionModuleNode } from './extension-manifest';

export type MenuItem = {
  key: string;
  title: string;
  description: string;
  icon: () => Promise<any>;
  node: ExtensionModuleNode;
};

export type MenuItemMap = { [key: string]: MenuItem };
