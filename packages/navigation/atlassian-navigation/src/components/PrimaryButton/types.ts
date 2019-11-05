import { ButtonProps } from '@atlaskit/button/types';

export type PrimaryButtonProps = Omit<ButtonProps, 'appearance'> & {
  /** Prop used to highlight the button is it is selected */
  isSelected?: boolean;
  /**  */
  testId?: string;
  /** A string to render as a tooltip */
  tooltip?: string;
};

export type PrimaryButtonSkeletonProps = {
  className?: string;
};
