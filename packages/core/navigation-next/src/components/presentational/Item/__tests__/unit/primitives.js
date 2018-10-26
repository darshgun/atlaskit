//@flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import { ItemPrimitiveBase } from '../../primitives';
import type {
  ItemRenderComponentProps,
  ItemPresentationProps,
} from '../../types';

const TestComponent = (props: ItemRenderComponentProps) => (
  <div>Test Component {props.className}</div>
);
const BeforeOrAfterComponent = (props: ItemPresentationProps) => (
  <div>Before/After Component {props.spacing}</div>
);

describe('ItemPrimitiveBase', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      after: undefined,
      before: undefined,
      component: undefined,
      href: undefined,
      id: undefined,
      index: undefined,
      innerRef: undefined,
      isSelected: false,
      isActive: false,
      isHover: false,
      onClick: () => {},
      spacing: 'default',
      styles: undefined,
      subText: undefined,
      target: undefined,
      text: 'item content',
      isFocused: false,
      theme: {
        context: 'default',
        mode: ({
          item: jest.fn().mockReturnValue({
            default: {},
          }),
        }: any),
      },
    };
  });

  it('should fetch component style', () => {
    shallow(<ItemPrimitiveBase {...defaultProps} />);

    expect(defaultProps.theme.mode.item).toHaveBeenCalledTimes(1);
  });

  it('should render only component prop if present', () => {
    defaultProps.component = TestComponent;

    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);

    expect(wrapper.find(TestComponent).length).toBe(1);
    expect(wrapper.find('a').length).toBe(0);
    expect(wrapper.find('button').length).toBe(0);
  });

  it('should pass all props and innerRef as ref prop to component if present', () => {
    defaultProps.component = TestComponent;

    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);
    const componentWrapper = wrapper.find(TestComponent);

    expect(componentWrapper.props()).toEqual(
      expect.objectContaining(wrapper.props()),
    );
    expect(componentWrapper.prop('ref')).toEqual(wrapper.prop('innerRef'));
  });

  it('should render an anchor element if href prop is present', () => {
    defaultProps.href = '<a>test</test>';

    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);

    expect(wrapper.find('a').length).toBe(1);
    expect(wrapper.find(TestComponent).length).toBe(0);
    expect(wrapper.find('button').length).toBe(0);
  });

  it('should pass expected props to anchor if href prop is present', () => {
    defaultProps.href = '<a>test</test>';

    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);

    const anchorWrapper = wrapper.find('a');
    expect(anchorWrapper.prop('href')).toBe(defaultProps.href);
    expect(anchorWrapper.prop('onClick')).toBe(defaultProps.onClick);
    expect(anchorWrapper.prop('target')).toBe(defaultProps.target);
    expect(anchorWrapper.prop('innerRef')).toBe(defaultProps.innerRef);
    expect(anchorWrapper.prop('ref')).toBe(defaultProps.innerRef);
  });

  it('should render a button element if onClick prop is present', () => {
    defaultProps.onClick = () => {};

    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);

    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('a').length).toBe(0);
    expect(wrapper.find(TestComponent).length).toBe(0);
  });

  it('should pass expected props to button if onClick prop is present', () => {
    defaultProps.onClick = jest.fn();

    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);

    expect(wrapper.find('button').prop('onClick')).toBe(defaultProps.onClick);
    expect(wrapper.find('button').prop('innerRef')).toBe(defaultProps.innerRef);
    expect(wrapper.find('button').prop('ref')).toBe(defaultProps.innerRef);
  });

  it('should always render text prop', () => {
    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);
    expect(wrapper.text()).toBe(wrapper.prop('text'));
  });

  it('should render Before with expected props if present', () => {
    defaultProps.before = BeforeOrAfterComponent;

    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);

    expect(wrapper.find(BeforeOrAfterComponent).props()).toEqual({
      isActive: false,
      isHover: false,
      isSelected: false,
      spacing: 'default',
      isFocused: false,
    });
  });

  it('should render After with expected props if present', () => {
    defaultProps.after = BeforeOrAfterComponent;

    const wrapper = mount(<ItemPrimitiveBase {...defaultProps} />);

    expect(wrapper.find(BeforeOrAfterComponent).props()).toEqual({
      isActive: false,
      isHover: false,
      isSelected: false,
      spacing: 'default',
      isFocused: false,
    });
  });
});
