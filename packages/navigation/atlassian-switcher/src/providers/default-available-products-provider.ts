import { createProvider } from './create-data-provider';
import { AvailableProductsResponse } from '../types';

export const createAvailableProductsProvider = (
  url: string = '/gateway/api/worklens/api/available-products',
) => {
  return createProvider<AvailableProductsResponse>('availableProducts', url);
};
