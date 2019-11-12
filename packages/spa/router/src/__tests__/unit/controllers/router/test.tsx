import React from 'react';
import { mount } from 'enzyme';
import { Router } from '../../../../controllers/router';

const MockLocation = {
  pathname: 'pathname',
  search: 'search',
  hash: 'hash',
};

const HistoryMock = {
  push: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  registerBlock: jest.fn(),
  listen: jest.fn(),
  createHref: jest.fn(),
  location: MockLocation,
  _history: jest.fn(),
};

const routes: any[] = [];

describe('<Router />', () => {
  it('renders a RouterContainer', () => {
    const wrapper = mount(
      // @ts-ignore
      <Router history={HistoryMock} routes={routes}>
        <div>hello</div>
      </Router>,
    );

    const component = wrapper.find('RouterContainer');

    expect(component).toHaveLength(1);

    expect(component.props()).toEqual(
      expect.objectContaining({
        history: HistoryMock,
        routes,
      }),
    );
  });
});
