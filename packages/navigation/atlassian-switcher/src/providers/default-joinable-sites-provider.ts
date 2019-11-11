import {
  createProviderWithCustomFetchData,
  ExportedDataProvider,
} from './create-data-provider';
import { JoinableSitesResponse } from '../types';

export type JoinableSiteDataFetcher = () => Promise<JoinableSitesResponse>;

export const defaultFetchData: JoinableSiteDataFetcher = () =>
  Promise.resolve({ sites: [] });

export const createJoinableSitesProvider = (
  fetchData: JoinableSiteDataFetcher = defaultFetchData,
): ExportedDataProvider<JoinableSitesResponse> => {
  return createProviderWithCustomFetchData<JoinableSitesResponse>(
    'joinableSites',
    fetchData,
  );
};
