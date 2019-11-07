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
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  title?: string;
  description?: string;
  isDisabled?: boolean;
}
