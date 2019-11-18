import { IconButtonProps } from '../IconButton/types';

export type SearchProps = Omit<IconButtonProps, 'icon'> & {
  text: string;
  tooltip: React.ReactNode;
};
