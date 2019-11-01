import { ExtensionNode } from './extension-manifest';

export type MenuItem = {
  key: string;
  title: string;
  description: string;
  icon: () => Promise<any>;
  node: ExtensionNode;
};

export type MenuItemMap = { [key: string]: MenuItem };
