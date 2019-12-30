import * as React from 'react';
import Button from '@atlaskit/button';
import Drawer from '@atlaskit/drawer';
import {
  mockAvailableProductsEndpoint,
  REQUEST_MEDIUM,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher, { AtlassianSwitcherPrefetchTrigger } from '../src';
import { resetAll } from '../src/providers/instance-data-providers';
import { resetAvailableProducts } from '../src/providers/products-data-provider';
import { createAvailableProductsProvider } from '../src/providers/default-available-products-provider';
import { createJoinableSitesProvider } from '../src/create-custom-provider';
import mockJoinableSites from '../test-helpers/mockJoinableSites';
import { JoinableSitesResponse } from '../src/types';

const AVAILABLE_PRODUCTS_API_ENDPOINT =
  'https://api-private.atlassian.com/worklens/api/available-products';

const customAvailableProductsDataProvider = createAvailableProductsProvider(
  AVAILABLE_PRODUCTS_API_ENDPOINT,
);

const fetchJoinableSites: () => Promise<JoinableSitesResponse> = () =>
  new Promise(resolve => {
    setTimeout(() => resolve({ sites: mockJoinableSites.sites }), 1000);
  });

const customJoinableSitesDataProvider = createJoinableSitesProvider(
  fetchJoinableSites,
);

const identityTransformer = (originalMockData: any) => originalMockData;

class GenericSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    mockAvailableProductsEndpoint(
      AVAILABLE_PRODUCTS_API_ENDPOINT,
      identityTransformer,
      REQUEST_MEDIUM,
    );
  }

  openDrawer = () => {
    this.setState({
      isDrawerOpen: true,
    });
  };

  clearCache = () => {
    resetAll();
    resetAvailableProducts(customAvailableProductsDataProvider);
  };

  onClose = () => {
    this.setState({
      isDrawerOpen: false,
    });
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="trello"
            disableCustomLinks
            disableRecentContainers
            disableHeadings
            triggerXFlow={this.onTriggerXFlow}
            availableProductsDataProvider={customAvailableProductsDataProvider}
            joinableSitesDataProvider={customJoinableSitesDataProvider}
          />
        </Drawer>
        <div style={{ display: 'flex' }}>
          <AtlassianSwitcherPrefetchTrigger
            availableProductsDataProvider={customAvailableProductsDataProvider}
            joinableSitesDataProvider={customJoinableSitesDataProvider}
          >
            <Button type="button" onClick={this.openDrawer}>
              Open drawer
            </Button>
          </AtlassianSwitcherPrefetchTrigger>
          <div style={{ width: 16 }} />
          <Button type="button" onClick={this.clearCache}>
            Clear cache
          </Button>
        </div>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(GenericSwitcherExample));
