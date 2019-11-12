import { IconButtonProps } from '../IconButton/types';

export type HelpProps = Omit<IconButtonProps, 'icon' | 'tooltip'> & {
  tooltip: React.ReactNode;
};
