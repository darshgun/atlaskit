import { ComponentType, ReactNode } from 'react';
import { IconButtonProps } from '../IconButton/types';

export type NotificationsProps = Omit<IconButtonProps, 'icon' | 'tooltip'> & {
  badge: ComponentType<{}>;
  tooltip: ReactNode;
};
