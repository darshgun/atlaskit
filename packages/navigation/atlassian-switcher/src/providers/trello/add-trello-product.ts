import {
  createResultComplete,
  isComplete,
  ProviderResult,
} from '../as-data-provider';
import { AvailableProductsResponse, AvailableSite } from '../../types';

export const addTrelloProduct = (
  availableProducts: ProviderResult<AvailableProductsResponse>,
): ProviderResult<AvailableProductsResponse> => {
  if (isComplete(availableProducts)) {
    return createResultComplete({
      sites: [
        ...availableProducts.data.sites,
        {
          adminAccess: false,
          availableProducts: [
            {
              activityCount: 0,
              productType: 'TRELLO',
              url: window.location.origin,
            },
          ],
          cloudId: 'trello',
          displayName: 'Trello',
          url: window.location.origin,
          avatar: null,
        } as AvailableSite,
      ],
    });
  }
  return availableProducts;
};
