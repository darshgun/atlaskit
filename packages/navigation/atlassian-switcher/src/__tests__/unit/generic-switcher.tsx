import React from 'react';
import { mount } from 'enzyme';

import GenericSwitcher, {
  GenericSwitcherProps,
} from '../../components/generic-switcher';
import { Product } from '../../types';

let mockResolveRecommendations: jest.Mock;
jest.mock('../../providers/recommendations', () => {
  const originalModule = jest.requireActual('../../providers/recommendations');
  mockResolveRecommendations = jest.fn();
  return {
    __esModule: true,
    ...originalModule,
    resolveRecommendations: mockResolveRecommendations.mockReturnValue(
      originalModule.resolveRecommendations,
    ),
  };
});

describe('generic-switcher', () => {
  let defaultProps: GenericSwitcherProps;
  beforeAll(() => {
    defaultProps = {
      cloudId: 'fake-cloud-id',
      messages: {},
      features: {
        disableCustomLinks: false,
        disableRecentContainers: false,
        disableHeadings: false,
        xflow: true,
        isDiscoverMoreForEveryoneEnabled: true,
        isEmceeLinkEnabled: true,
        isDiscoverSectionEnabled: true,
      },
      triggerXFlow: () => {},
      onDiscoverMoreClicked: () => {},
      product: Product.TRELLO,
    };
  });
  it('should not pass featureFlags to the recommendation resolver when recommendationFeatureFlags is not set', () => {
    mount(<GenericSwitcher {...defaultProps} />);
    expect(mockResolveRecommendations).toBeCalledWith({});
  });
  it('should pass featureFlags to the recommendations resolver when recommendationFeatureFlags is set', () => {
    const recommendationsFeatureFlags = {
      mySpecialRecommendationsFeatureFlag: true,
    };
    mount(
      <GenericSwitcher
        {...defaultProps}
        recommendationsFeatureFlags={recommendationsFeatureFlags}
      />,
    );
    expect(mockResolveRecommendations).toBeCalledWith(
      recommendationsFeatureFlags,
    );
  });
});
