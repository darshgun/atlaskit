import { ButtonProps } from '@atlaskit/button';

export type IconButtonProps = Pick<ButtonProps, 'onClick'> & {
  className?: string;
  icon: ButtonProps['iconBefore'];
  testId?: string;
  tooltip: string;
};

export type IconButtonSkeletonProps = {
  className?: string;
  marginLeft?: number;
  marginRight?: number;
  size?: number;
};
