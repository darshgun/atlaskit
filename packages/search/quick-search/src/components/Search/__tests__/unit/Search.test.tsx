import { mount, shallow, ReactWrapper } from 'enzyme';
import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import Search from '../../Search';

describe('Search', () => {
  const isInputFocused = (wrapper: ReactWrapper) =>
    wrapper.find('input').getDOMNode() === document.activeElement;

  it('should auto focus on mount', () => {
    const wrapper = mount(<Search onInput={() => {}} onKeyDown={() => {}} />);

    expect(isInputFocused(wrapper)).toBe(true);
  });

  it('should show spinner when loading', () => {
    expect(
      mount(<Search onInput={() => {}} onKeyDown={() => {}} isLoading />).find(
        Spinner,
      ).length,
    ).toBe(1);
    expect(
      mount(
        <Search onInput={() => {}} onKeyDown={() => {}} isLoading={false} />,
      ).find(Spinner).length,
    ).toBe(0);
  });

  it('should render input controls if provided', () => {
    const wrapper = shallow(
      <Search inputControls={<button key="testKey">Test Btn</button>} />,
    );
    const inputControlsContainer = wrapper.find('SearchInputControlsContainer');

    expect(inputControlsContainer.length).toBe(1);
    expect(inputControlsContainer.children().length).toBe(1);
    expect(inputControlsContainer.childAt(0).key()).toBe('testKey');
  });
});
