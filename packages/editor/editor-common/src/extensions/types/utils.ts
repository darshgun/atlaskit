import { Icon, MaybeADFEntity } from './extension-manifest';

export type MenuItem = {
  key: string;
  title: string;
  description: string;
  icon: Icon;
  node: MaybeADFEntity;
};

export type MenuItemMap = { [key: string]: MenuItem };
