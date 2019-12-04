import * as React from 'react';
import {
  mockEndpoints,
  DataTransformer,
} from '@atlaskit/atlassian-switcher-test-utils';
import styled from 'styled-components';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import {
  AvailableSite,
  AvailableProductsResponse,
  WorklensProductType,
} from '../src/types';
import AtlassianSwitcher from '../src';
import { createProviderWithCustomFetchData } from '../src/providers/create-data-provider';
import { DEFAULT_AVAILABLE_PRODUCTS_ENDPOINT } from '../src/providers/default-available-products-provider';
import { fetchJson } from '../src/utils/fetch';

const FakeTrelloInlineDialog = styled.div`
  width: 360px;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 0 8px;
  display: inline-block;
  margin: 5px;
  vertical-align: top;
  box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25),
    0 0 0 1px rgba(9, 30, 66, 0.08);
`;

const Header = styled.div`
  text-align: center;
  position: relative;
  width: 100%;
  padding: 10px 0;
  color: #5e6c84;
  border-bottom: 1px solid rgba(9, 30, 66, 0.13);
  box-sizing: border-box;
  font-weight: 400;
`;

const Content = styled.div`
  padding-top: 24px;
`;

const CloseButtonWrapper = styled.div`
  position: absolute;
  right: 0px;
  top: 7px;
`;

const AVAILABLE_SITE_TRELLO: AvailableSite = {
  adminAccess: false,
  availableProducts: [
    {
      activityCount: 0,
      productType: WorklensProductType.TRELLO,
      url: 'https://trello.com',
    },
  ],
  cloudId: 'trello',
  displayName: 'Trello',
  url: 'https://trello.com',
  avatar: null,
};

const mockTrelloDataProvider = async () => {
  const response = await fetchJson<AvailableProductsResponse>(
    DEFAULT_AVAILABLE_PRODUCTS_ENDPOINT,
  );
  if (response && response.sites) {
    response.sites.push(AVAILABLE_SITE_TRELLO);
  }
  return response;
};

const mockProviderWithCustomFetchData = () =>
  createProviderWithCustomFetchData<AvailableProductsResponse>(
    'availableProducts',
    mockTrelloDataProvider,
  );

const mockEndpointsDataTransformer: DataTransformer = originalMockData => ({
  ...originalMockData,
  AVAILABLE_PRODUCTS_DATA: {
    // Excluding JSD here to rather display it in the recommended products list
    sites: originalMockData.AVAILABLE_PRODUCTS_DATA.sites
      .map(site => {
        site.availableProducts = site.availableProducts.filter(
          availableProduct =>
            availableProduct.productType !==
            WorklensProductType.JIRA_SERVICE_DESK,
        );
        return site;
      })
      .filter(site => site.availableProducts.length),
  },
});

class InlineDialogSwitcherExample extends React.Component {
  state = {
    isLoaded: false,
  };

  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    mockEndpoints('trello', mockEndpointsDataTransformer);
    this.setState({
      isLoaded: true,
    });
  };

  renderFakeTrelloChrome(content: React.ReactNode) {
    return (
      <FakeTrelloInlineDialog>
        <Header>
          More from Atlassian
          <CloseButtonWrapper>
            <EditorCloseIcon label="Close" />
          </CloseButtonWrapper>
        </Header>
        <Content>{content}</Content>
      </FakeTrelloInlineDialog>
    );
  }

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
      this.state.isLoaded &&
      this.renderFakeTrelloChrome(
        <AtlassianSwitcher
          product="trello"
          disableCustomLinks
          disableRecentContainers
          appearance="standalone"
          theme={trelloTheme}
          isDiscoverSectionEnabled
          availableProductsDataProvider={mockProviderWithCustomFetchData()}
          recommendationsFeatureFlags={{
            isProductStoreInTrelloEnabled: true,
          }}
          isDiscoverMoreForEveryoneEnabled
          onDiscoverMoreClicked={this.onDiscoverMoreClicked}
          triggerXFlow={this.onTriggerXFlow}
        />,
      )
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(InlineDialogSwitcherExample),
);
