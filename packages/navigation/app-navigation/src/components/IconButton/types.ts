import { ButtonProps } from '@atlaskit/button';
import { AppNavigationTheme } from '../../theme';

export type IconButtonProps = Pick<ButtonProps, 'onClick'> & {
  className?: string;
  icon: ButtonProps['iconBefore'];
  testId?: string;
  theme: AppNavigationTheme;
  tooltip: string;
};

export type IconButtonSkeletonProps = {
  className?: string;
  marginLeft?: number;
  marginRight?: number;
  size?: number;
};
