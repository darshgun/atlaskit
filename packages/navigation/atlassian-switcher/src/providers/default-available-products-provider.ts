import { createProvider, ExportedDataProvider } from './create-data-provider';
import { AvailableProductsResponse } from '../types';

export const DEFAULT_AVAILABLE_PRODUCTS_ENDPOINT =
  '/gateway/api/worklens/api/available-products';

export const createAvailableProductsProvider = (
  url: string = DEFAULT_AVAILABLE_PRODUCTS_ENDPOINT,
): ExportedDataProvider<AvailableProductsResponse> => {
  return createProvider<AvailableProductsResponse>('availableProducts', url);
};
