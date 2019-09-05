import React from 'react';
import { shallow } from 'enzyme';

jest.doMock('react-dom', () => {
  return {
    render: jest.fn(content => shallow(<div>{content}</div>)),
  };
});

const { render } = require('../render');

describe('render', () => {
  test('should render the switcher with analytics and intl providers', () => {
    const noop = () => {};

    const result = render(
      {
        appearance: 'standalone',
        cloudId: 'some-cloud-id',
        disableCustomLinks: true,
        disableHeadings: true,
        disableRecentContainers: true,
        enableUserCentricProducts: true,
        product: 'opsgenie',
      },
      noop,
      document.createElement('div'),
    );

    expect(result).toMatchSnapshot();
  });
});
