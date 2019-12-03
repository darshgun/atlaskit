import { IconButtonProps } from '../IconButton/types';

export type SignInProps = Omit<IconButtonProps, 'icon' | 'tooltip'> & {
  tooltip: React.ReactNode;
};
