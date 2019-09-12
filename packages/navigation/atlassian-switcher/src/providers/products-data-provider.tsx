import * as React from 'react';

import { ProviderResult, ResultLoading, Status } from './as-data-provider';
import { AvailableProductsResponse } from '../types';
import { createAvailableProductsProvider } from './default-available-products-provider';

const {
  fetchMethod: fetchAvailableProducts,
  providerComponent: DefaultDataProviderComponent,
} = createAvailableProductsProvider();

export type AvailableProductsDataProvider = ReturnType<
  typeof createAvailableProductsProvider
>;

const unresolvedAvailableProducts: ResultLoading = {
  status: Status.LOADING,
  data: null,
};

export const AvailableProductsProvider = ({
  isUserCentric,
  children,
  availableProductsDataProvider,
}: {
  isUserCentric: boolean;
  children: (
    availableProducts: ProviderResult<AvailableProductsResponse>,
  ) => React.ReactNode;
  availableProductsDataProvider?: AvailableProductsDataProvider;
}) => {
  if (isUserCentric) {
    const CustomDataProviderComponent =
      availableProductsDataProvider &&
      availableProductsDataProvider.providerComponent;
    const DataProvider =
      CustomDataProviderComponent || DefaultDataProviderComponent;

    return <DataProvider>{children}</DataProvider>;
  }
  // We should never be reading from this provider in non-user-centric mode, so here I model it as a provider that never resolves.
  return (
    <React.Fragment>{children(unresolvedAvailableProducts)}</React.Fragment>
  );
};

export const prefetchAvailableProducts = (
  customProvider?: AvailableProductsDataProvider,
) => {
  if (customProvider) {
    customProvider.fetchMethod({});
    return;
  }

  fetchAvailableProducts({});
};

export const resetAvailableProducts = (
  customProvider?: AvailableProductsDataProvider,
) => {
  if (customProvider) {
    customProvider.fetchMethod.reset();
    return;
  }

  fetchAvailableProducts.reset();
};
