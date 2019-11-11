export type MenuGroupProps = {
  maxHeight?: number | string;
  children: React.ReactNode;
};

export type SectionProps = {
  isScrollable?: boolean;
  hasSeparator?: boolean;
  children: React.ReactNode;
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
