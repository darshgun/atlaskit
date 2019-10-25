import { createProvider, ExportedDataProvider } from './create-data-provider';
import { JoinableSitesResponse } from '../types';

export type JoinableSiteDataSource = () => Promise<JoinableSitesResponse>;

export const defaultDataSource: JoinableSiteDataSource = () =>
  Promise.resolve({ sites: [] });

export const createJoinableSitesProvider = (
  dataSource: JoinableSiteDataSource = defaultDataSource,
): ExportedDataProvider<JoinableSitesResponse> => {
  return createProvider<JoinableSitesResponse>('joinableSites', dataSource);
};
