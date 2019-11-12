import { ButtonProps } from '@atlaskit/button/types';

export type PrimaryButtonProps = Omit<ButtonProps, 'appearance'> & {
  /** Prop used to highlight the button is it is the active item */
  isHighlighted?: boolean;
  /**  */
  testId?: string;
  /** A string or React Node to render as a tooltip */
  tooltip?: React.ReactNode;
};

export type PrimaryButtonSkeletonProps = {
  className?: string;
};
