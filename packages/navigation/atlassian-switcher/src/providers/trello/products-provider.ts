import { AvailableProductsResponse } from '../../types';
import { withCached } from '../../utils/with-cached';
import { fetchJson } from '../../utils/fetch';
import asDataProvider from '../as-data-provider';
import { Environment, getEnvName } from '../../utils/environment';

export const getAvailableProductsUrl = (env: Environment) => {
  const origin =
    env === Environment.Production
      ? 'https://api-gateway.trello.com'
      : 'https://api-gateway.trellis.coffee';

  return `${origin}/gateway/api/worklens/api/available-products`;
};

const fetchAvailableProducts = withCached(() =>
  fetchJson<AvailableProductsResponse>(
    getAvailableProductsUrl(getEnvName(location.origin)),
  ),
);

export const TrelloAvailableProductsProvider = asDataProvider(
  'availableProducts',
  fetchAvailableProducts,
  fetchAvailableProducts.cached,
);
