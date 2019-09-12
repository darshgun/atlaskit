import { fetchJson } from '../utils/fetch';
import asDataProvider from './as-data-provider';
import { withCached } from '../utils/with-cached';

export const createProvider = <T>(name: string, url: string) => {
  const fetchMethod = withCached((param: object) => fetchJson<T>(url));

  return {
    fetchMethod,
    providerComponent: asDataProvider(name, fetchMethod, fetchMethod.cached),
  };
};
