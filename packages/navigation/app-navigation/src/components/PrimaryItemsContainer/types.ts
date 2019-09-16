import { ReactNodeArray, ReactNode } from 'react';

export type PrimaryItemsContainerProps = {
  moreLabel: ReactNode;
  items: ReactNodeArray;
};

export type PrimaryItemsContainerSkeletonProps = {
  count: number;
};
