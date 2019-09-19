// @flow

import React from 'react';
import { mount } from 'enzyme';

import { HorizontalNavigationContainer } from '../../primitives';

describe('HorizontalNavigationContainer', () => {
  it('applies the correct positioning to the container', () => {
    const wrapper = mount(
      <HorizontalNavigationContainer topOffset={50}>
        children
      </HorizontalNavigationContainer>,
    );
    // $FlowFixMe The current version of flow does not support type augmentation correctly
    expect(wrapper).toHaveStyleDeclaration('position', 'fixed');
    // $FlowFixMe The current version of flow does not support type augmentation correctly
    expect(wrapper).toHaveStyleDeclaration('top', '50px');
  });
});
