export type MenuGroup = {
  maxHeight?: number | string;
};

export type Section = {
  isScrollable?: boolean;
  shouldShowSeparator?: boolean;
};

export interface ItemProps {
  elemBefore?: React.ReactNode;
  elemAfter?: React.ReactNode;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  title?: string;
  description?: string;
  isDisabled?: boolean;
  children: React.ReactNode;
}

export interface LinkItemProps extends ItemProps {
  href: string;
}
