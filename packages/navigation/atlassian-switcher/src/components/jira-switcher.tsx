import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from '../primitives/themed-switcher';
import {
  CustomLinksProvider,
  MANAGE_HREF,
} from '../providers/jira-data-providers';
import CommonDataProvider from '../providers/common-data-provider';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import {
  FeatureMap,
  AvailableProductsResponse,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
  Product,
  WithRecommendationsFeatureFlags,
} from '../types';
import { ProviderResult } from '../providers/as-data-provider';
import {
  JoinableSitesProvider,
  JoinableSitesDataProvider,
} from '../providers/joinable-sites-data-provider';
import { AvailableProductsProvider } from '../providers/products-data-provider';
import { WithTheme } from '../theme/types';

type JiraSwitcherProps = WithTheme &
  Partial<WithRecommendationsFeatureFlags> & {
    cloudId: string;
    messages: Messages;
    features: FeatureMap;
    triggerXFlow: TriggerXFlowCallback;
    onDiscoverMoreClicked: DiscoverMoreCallback;
    joinableSitesDataProvider?: JoinableSitesDataProvider;
  };

export default (props: JiraSwitcherProps) => (
  <JoinableSitesProvider
    joinableSitesDataProvider={props.joinableSitesDataProvider}
  >
    {joinableSites => (
      <CustomLinksProvider
        disableCustomLinks={props.features.disableCustomLinks}
      >
        {customLinks => (
          <AvailableProductsProvider>
            {(availableProducts: ProviderResult<AvailableProductsResponse>) => (
              <CommonDataProvider
                cloudId={props.cloudId}
                disableRecentContainers={props.features.disableRecentContainers}
                recommendationsFeatureFlags={{
                  isDiscoverSectionEnabled:
                    props.features.isDiscoverSectionEnabled,
                  ...props.recommendationsFeatureFlags,
                }}
              >
                {providerResults => {
                  const {
                    showManageLink,
                    ...switcherLinks
                  } = mapResultsToSwitcherProps(
                    props.cloudId,
                    { customLinks, ...providerResults },
                    props.features,
                    availableProducts,
                    joinableSites,
                    Product.JIRA,
                  );

                  return (
                    <Switcher
                      {...props}
                      {...switcherLinks}
                      manageLink={showManageLink ? MANAGE_HREF : undefined}
                    />
                  );
                }}
              </CommonDataProvider>
            )}
          </AvailableProductsProvider>
        )}
      </CustomLinksProvider>
    )}
  </JoinableSitesProvider>
);
