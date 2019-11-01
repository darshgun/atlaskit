import { ComponentType, ReactNodeArray, ReactNode } from 'react';

export type PrimaryItemsContainerProps = {
  moreLabel: ReactNode;
  items: ReactNodeArray;
  create?: ComponentType<{}>;
};

export type PrimaryItemsContainerSkeletonProps = {
  count: number;
};
