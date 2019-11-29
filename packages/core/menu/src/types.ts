export type MenuGroupProps = {
  maxHeight?: number | string;
  children: React.ReactNode;
};

export type SectionProps = {
  isScrollable?: boolean;
  hasSeparator?: boolean;
  children: React.ReactNode;
};

export interface BaseItemProps {
  elemBefore?: React.ReactNode;
  elemAfter?: React.ReactNode;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  title?: string;
  description?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  children?: React.ReactNode;
  href?: string;
  component?: React.ComponentType<{ wrapperClass: string }>;
}

export type ButtonItemProps = Omit<BaseItemProps, 'component' | 'href'>;
export type LinkItemProps = Omit<BaseItemProps, 'component'>;
export type CustomItemProps = Omit<BaseItemProps, 'href'>;

export type SkeletonItemProps = {
  hasAvatar?: boolean;
  hasIcon?: boolean;
  width?: string | number;
};
