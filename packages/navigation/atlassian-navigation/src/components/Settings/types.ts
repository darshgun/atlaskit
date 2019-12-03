import { IconButtonProps } from '../IconButton/types';

export type SettingsProps = Omit<IconButtonProps, 'icon' | 'tooltip'> & {
  tooltip: React.ReactNode;
};
