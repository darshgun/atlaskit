import * as React from 'react';
import { prefetchAll } from './providers/instance-data-providers';
import {
  prefetchAvailableProducts,
  AvailableProductsDataProvider,
} from './providers/products-data-provider';
import { prefetchJoinableSites } from './providers/joinable-sites-data-provider';
import prefetchSwitcherBundles from './utils/prefetch-bundles';
import { FeatureFlagProps } from './types';

type PrefetchTriggerProps = {
  cloudId?: string;
  product?: string;
  Container?: React.ReactType;
  availableProductsDataProvider?: AvailableProductsDataProvider;
  joinableSitesDataProvider?: any;
} & Partial<FeatureFlagProps>;

export const prefetch = (props: PrefetchTriggerProps) => {
  const { cloudId, product } = props;

  prefetchSwitcherBundles(product);
  prefetchAvailableProducts(props.availableProductsDataProvider);
  prefetchJoinableSites(props.joinableSitesDataProvider);

  if (cloudId) {
    prefetchAll({ cloudId });
  }
};
