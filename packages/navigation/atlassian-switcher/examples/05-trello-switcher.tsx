import * as React from 'react';
import {
  DataTransformer,
  mockAvailableProductsEndpoint,
  mockEndpoints,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import {
  AvailableProductsResponse,
  AvailableSite,
  WorklensProductType,
} from '../src/types';
import AtlassianSwitcher from '../src';
import { Environment } from '../src/utils/environment';
import { getAvailableProductsUrl } from '../src/providers/trello/products-provider';
import { FakeTrelloChrome } from './helpers/FakeTrelloChrome';

const mockEndpointsDataTransformer: DataTransformer = originalMockData => {
  const availableProducts = originalMockData.AVAILABLE_PRODUCTS_DATA as AvailableProductsResponse;
  return {
    ...originalMockData,
    AVAILABLE_PRODUCTS_DATA: {
      sites: availableProducts.sites
        .map((site: AvailableSite) => {
          // Excluding JSD here to rather display it in the recommended products list
          site.availableProducts = site.availableProducts.filter(
            availableProduct =>
              ![
                WorklensProductType.JIRA_SERVICE_DESK,
                WorklensProductType.BITBUCKET,
              ].includes(availableProduct.productType),
          );
          return site;
        })
        .filter((site: AvailableSite) => site.availableProducts.length),
    },
  };
};

class InlineDialogSwitcherExample extends React.Component {
  state = {
    isLoaded: false,
  };

  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    mockAvailableProductsEndpoint(getAvailableProductsUrl(Environment.Staging));
    mockEndpoints('trello', mockEndpointsDataTransformer);
    this.setState({
      isLoaded: true,
    });
  };

  onTriggerXFlow() {
    console.log('triggerXFlow');
  }

  onDiscoverMoreClicked() {
    console.log('discoverMoreClicked');
  }

  render() {
    // colors picked from trello's website. Alpha channel was removed to avoid overlays
    const trelloTheme = {
      primaryTextColor: '#172b4d',
      secondaryTextColor: '#5e6c84',
      primaryHoverBackgroundColor: '#E0E2E5',
      secondaryHoverBackgroundColor: '#F5F6F7',
    };

    return (
      this.state.isLoaded && (
        <FakeTrelloChrome>
          <AtlassianSwitcher
            product="trello"
            disableCustomLinks
            disableRecentContainers
            appearance="standalone"
            theme={trelloTheme}
            isDiscoverSectionEnabled
            recommendationsFeatureFlags={{
              isProductStoreInTrelloEnabled: true,
            }}
            isDiscoverMoreForEveryoneEnabled
            onDiscoverMoreClicked={this.onDiscoverMoreClicked}
            triggerXFlow={this.onTriggerXFlow}
          />
        </FakeTrelloChrome>
      )
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(InlineDialogSwitcherExample),
);
