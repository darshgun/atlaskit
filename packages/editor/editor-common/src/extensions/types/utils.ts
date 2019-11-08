import { ExtensionModuleNode, Icon } from './extension-manifest';

export type MenuItem = {
  key: string;
  title: string;
  description: string;
  icon: Icon;
  node: ExtensionModuleNode;
};

export type MenuItemMap = { [key: string]: MenuItem };
