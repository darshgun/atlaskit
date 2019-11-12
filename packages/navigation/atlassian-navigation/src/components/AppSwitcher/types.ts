import { IconButtonProps } from '../IconButton/types';

export type AppSwitcherProps = Omit<IconButtonProps, 'icon' | 'tooltip'> & {
  tooltip: React.ReactNode;
};
