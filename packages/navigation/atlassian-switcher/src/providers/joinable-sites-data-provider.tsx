import * as React from 'react';

import { JoinableSitesResponse } from '../types';
import { ProviderResult } from './as-data-provider';
import { createJoinableSitesProvider } from './default-joinable-sites-provider';
import { ExportedDataProvider, DataProvider } from './create-data-provider';

const {
  fetchMethod: fetchJoinableSites,
  ProviderComponent: DefaultDataProviderComponent,
} = createJoinableSitesProvider() as DataProvider<JoinableSitesResponse>;

export type JoinableSitesDataProvider = ExportedDataProvider<
  JoinableSitesResponse
>;

export const JoinableSitesProvider = ({
  children,
  joinableSitesDataProvider,
}: {
  children: (
    joinableSites: ProviderResult<JoinableSitesResponse>,
  ) => React.ReactNode;
  joinableSitesDataProvider?: JoinableSitesDataProvider;
}) => {
  const CustomDataProviderComponent =
    joinableSitesDataProvider && joinableSitesDataProvider.ProviderComponent;

  const DataProviderComponent =
    CustomDataProviderComponent || DefaultDataProviderComponent;

  return <DataProviderComponent>{children}</DataProviderComponent>;
};

export const prefetchJoinableSites = (
  customProvider?: JoinableSitesDataProvider,
) => {
  if (customProvider) {
    (customProvider as DataProvider<JoinableSitesResponse>).fetchMethod({});
    return;
  }

  fetchJoinableSites({});
};

export const resetJoinableSites = (
  customProvider?: JoinableSitesDataProvider,
) => {
  if (customProvider) {
    (customProvider as DataProvider<JoinableSitesResponse>).fetchMethod.reset();
    return;
  }

  fetchJoinableSites.reset();
};
