import React from 'react';
import { Messages } from 'react-intl';
import Switcher from '../primitives/themed-switcher';
import {
  Product,
  FeatureMap,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
  WithRecommendationsFeatureFlags,
} from '../types';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import {
  JoinableSitesProvider,
  JoinableSitesDataProvider,
} from '../providers/joinable-sites-data-provider';
import { RecommendationsEngineProvider } from '../providers/recommendations-provider';
import { WithTheme } from '../theme/types';
import { createResultComplete } from '../providers/as-data-provider';
import { emptyRecentContainers } from '../providers/instance-data-providers';
import { TrelloAvailableProductsProvider } from '../providers/trello/products-provider';
import { addTrelloProduct } from '../providers/trello/add-trello-product';

export type TrelloSwitcherProps = WithTheme &
  Partial<WithRecommendationsFeatureFlags> & {
    messages: Messages;
    features: FeatureMap;
    triggerXFlow: TriggerXFlowCallback;
    onDiscoverMoreClicked: DiscoverMoreCallback;
    joinableSitesDataProvider?: JoinableSitesDataProvider;
  };

export default (props: TrelloSwitcherProps) => (
  <JoinableSitesProvider
    joinableSitesDataProvider={props.joinableSitesDataProvider}
  >
    {joinableSites => (
      <TrelloAvailableProductsProvider>
        {availableProducts => (
          <RecommendationsEngineProvider
            featureFlags={props.recommendationsFeatureFlags}
          >
            {productRecommendations => {
              const switcherLinks = mapResultsToSwitcherProps(
                null,
                {
                  productRecommendations,
                  /**
                   * Mocking providers below due to concepts they backing are not supported by Trello Switcher
                   * specifically or in account centric mode in general
                   */
                  recentContainers: emptyRecentContainers,
                  managePermission: createResultComplete(false),
                  addProductsPermission: createResultComplete(false),
                  isXFlowEnabled: createResultComplete(true),
                },
                props.features,
                addTrelloProduct(availableProducts),
                joinableSites,
                Product.TRELLO,
              );
              return <Switcher {...props} {...switcherLinks} />;
            }}
          </RecommendationsEngineProvider>
        )}
      </TrelloAvailableProductsProvider>
    )}
  </JoinableSitesProvider>
);
