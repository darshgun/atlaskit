import * as React from 'react';
import { shallow } from 'enzyme';

import { defaultDataSource } from '../../default-joinable-sites-provider';
import {
  JoinableSitesProvider,
  prefetchJoinableSites,
} from '../../joinable-sites-data-provider';

import { JoinableSitesResponse } from '../../../types';

import { createProvider } from '../../create-data-provider';

describe('joinable-sites-data-providers', () => {
  test('should render using the default provider', () => {
    const wrapper = shallow(
      <JoinableSitesProvider>{items => items}</JoinableSitesProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('should render using a custom provider', () => {
    const customProvider = createProvider<JoinableSitesResponse>(
      'my-joinble-sites-provider',
      defaultDataSource,
    );
    const wrapper = shallow(
      <JoinableSitesProvider joinableSitesDataProvider={customProvider}>
        {items => items}
      </JoinableSitesProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('should prefetch using the custom provider if passed down', () => {
    const fetchMethod = jest.fn();

    prefetchJoinableSites({
      fetchMethod,
    } as any);

    expect(fetchMethod).toBeCalledTimes(1);
  });
});
