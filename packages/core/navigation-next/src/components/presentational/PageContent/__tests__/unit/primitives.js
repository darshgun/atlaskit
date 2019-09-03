// @flow

import React from 'react';
import { mount } from 'enzyme';

import { PageWrapper } from '../../primitives';

describe('PageWrapper', () => {
  const commonProps = {
    disableInteraction: false,
    leftOffset: 0,
    topOffset: 0,
  };

  it('applies the correct left margin to the container when a leftOffset is provided', () => {
    const wrapper = mount(<PageWrapper {...commonProps} leftOffset={50} />);
    // $FlowFixMe The current version of flow does not support type augmentation correctly
    expect(wrapper).toHaveStyleDeclaration('margin-left', '50px');
  });

  it('applies the correct top margin to the container when a topOffset is provided', () => {
    const wrapper = mount(<PageWrapper {...commonProps} topOffset={50} />);
    // $FlowFixMe The current version of flow does not support type augmentation correctly
    expect(wrapper).toHaveStyleDeclaration('margin-top', '50px');
  });
});
