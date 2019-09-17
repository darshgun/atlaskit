import * as React from 'react';
import Button from '@atlaskit/button';
import Drawer from '@atlaskit/drawer';
import {
  mockAvailableProductsEndpoint,
  REQUEST_MEDIUM,
} from './helpers/mock-endpoints';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher, { AtlassianSwitcherPrefetchTrigger } from '../src';
import { resetAll } from '../src/providers/instance-data-providers';
import { resetAvailableProducts } from '../src/providers/products-data-provider';
import { createAvailableProductsProvider } from '../src/providers/default-available-products-provider';

const AVAILABLE_PRODUCTS_API_ENDPOINT =
  'https://api-private.atlassian.com/worklens/api/available-products';

const customAvailableProductsDataProvider = createAvailableProductsProvider(
  AVAILABLE_PRODUCTS_API_ENDPOINT,
);

class GenericSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    mockAvailableProductsEndpoint(
      AVAILABLE_PRODUCTS_API_ENDPOINT,
      originalMockData => originalMockData,
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
            enableUserCentricProducts
            availableProductsDataProvider={customAvailableProductsDataProvider}
          />
        </Drawer>
        <div style={{ display: 'flex' }}>
          <AtlassianSwitcherPrefetchTrigger
            enableUserCentricProducts
            availableProductsDataProvider={customAvailableProductsDataProvider}
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
