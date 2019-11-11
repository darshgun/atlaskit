import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from '../primitives/themed-switcher';
import CommonDataProvider from '../providers/common-data-provider';
import {
  Product,
  FeatureMap,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
} from '../types';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import {
  AvailableProductsProvider,
  AvailableProductsDataProvider,
} from '../providers/products-data-provider';
import {
  JoinableSitesProvider,
  JoinableSitesDataProvider,
} from '../providers/joinable-sites-data-provider';
import { WithTheme } from '../theme/types';

type GenericSwitcherProps = WithTheme & {
  cloudId?: string;
  messages: Messages;
  features: FeatureMap;
  triggerXFlow: TriggerXFlowCallback;
  onDiscoverMoreClicked: DiscoverMoreCallback;
  product: Exclude<Product, Product.JIRA | Product.CONFLUENCE>;
  availableProductsDataProvider?: AvailableProductsDataProvider;
  joinableSitesDataProvider?: JoinableSitesDataProvider;
};

export default (props: GenericSwitcherProps) => (
  <JoinableSitesProvider
    joinableSitesDataProvider={props.joinableSitesDataProvider}
  >
    {joinableSites => (
      <AvailableProductsProvider
        availableProductsDataProvider={props.availableProductsDataProvider}
      >
        {availableProducts => (
          <CommonDataProvider
            cloudId={props.cloudId}
            disableRecentContainers={props.features.disableRecentContainers}
          >
            {providerResults => {
              const switcherLinks = mapResultsToSwitcherProps(
                props.cloudId,
                providerResults,
                props.features,
                availableProducts,
                joinableSites,
                props.product,
              );
              return <Switcher {...props} {...switcherLinks} />;
            }}
          </CommonDataProvider>
        )}
      </AvailableProductsProvider>
    )}
  </JoinableSitesProvider>
);
