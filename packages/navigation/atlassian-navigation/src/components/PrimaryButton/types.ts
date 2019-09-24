import { ButtonProps } from '@atlaskit/button/types';

export type PrimaryButtonProps = Omit<ButtonProps, 'appearance'> & {
  /**  */
  testId?: string;
  /** A string to render as a tooltip */
  tooltip?: string;
};

export type PrimaryButtonSkeletonProps = {
  className?: string;
};
