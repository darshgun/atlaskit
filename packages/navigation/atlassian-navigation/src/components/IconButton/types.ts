import { ButtonProps } from '@atlaskit/button';

export type IconButtonProps = Omit<
  ButtonProps,
  'children' | 'iconBefore' | 'iconAfter'
> & {
  icon: ButtonProps['iconBefore'];
  testId?: string;
  tooltip: React.ReactNode;
};

export type IconButtonSkeletonProps = {
  className?: string;
  marginLeft?: number;
  marginRight?: number;
  size?: number;
};
