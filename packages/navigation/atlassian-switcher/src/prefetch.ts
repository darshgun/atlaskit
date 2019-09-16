import * as React from 'react';
import { prefetchAll } from './providers/instance-data-providers';
import {
  prefetchAvailableProducts,
  AvailableProductsDataProvider,
} from './providers/products-data-provider';
import prefetchSwitcherBundles from './utils/prefetch-bundles';
import { FeatureFlagProps } from './types';

type PrefetchTriggerProps = {
  cloudId?: string;
  product?: string;
  Container?: React.ReactType;
  availableProductsDataProvider?: AvailableProductsDataProvider;
} & Partial<FeatureFlagProps>;

export const prefetch = (props: PrefetchTriggerProps) => {
  const { cloudId, enableUserCentricProducts, product } = props;

  prefetchSwitcherBundles(product);

  if (cloudId) {
    prefetchAll({ cloudId });
  }

  if (enableUserCentricProducts) {
    prefetchAvailableProducts(props.availableProductsDataProvider);
  }
};
