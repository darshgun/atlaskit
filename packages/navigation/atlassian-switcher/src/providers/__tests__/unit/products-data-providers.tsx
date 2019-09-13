import * as React from 'react';
import { shallow } from 'enzyme';
import { AvailableProductsProvider } from '../../products-data-provider';
import { createProvider } from '../../create-data-provider';
import { AvailableProductsResponse } from '../../../types';

describe('products-data-providers', () => {
  test('should render using the default provider', () => {
    const wrapper = shallow(
      <AvailableProductsProvider isUserCentric>
        {items => items}
      </AvailableProductsProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('should render using a custom provider', () => {
    const customProvider = createProvider<AvailableProductsResponse>(
      'my-provider',
      'my-new-endpoint',
    );
    const wrapper = shallow(
      <AvailableProductsProvider
        isUserCentric
        availableProductsDataProvider={customProvider}
      >
        {items => items}
      </AvailableProductsProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
