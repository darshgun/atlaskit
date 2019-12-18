import * as React from 'react';
import {
  DataTransformer,
  mockAvailableProductsEndpoint,
  mockEndpoints,
} from '@atlaskit/atlassian-switcher-test-utils';
import styled from 'styled-components';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import {
  AvailableProductsResponse,
  AvailableSite,
  WorklensProductType,
} from '../src/types';
import AtlassianSwitcher from '../src';
import { Environment } from '../src/utils/environment';
import { getAvailableProductsUrl } from '../src/providers/trello/products-provider';
import { enrichFetchError } from '../src/utils/fetch';

const FakeTrelloInlineDialog = styled.div`
  width: 280px;
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

const mockAvailableProductsTransformer: DataTransformer = originalMockData => {
  return {
    ...originalMockData,
    AVAILABLE_PRODUCTS_DATA: Promise.reject(
      enrichFetchError(new Error('Failed to fetch'), 401),
    ),
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
    mockAvailableProductsEndpoint(
      getAvailableProductsUrl(Environment.Staging),
      mockAvailableProductsTransformer,
    );
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
