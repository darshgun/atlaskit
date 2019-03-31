import * as React from 'react';
import { mount } from 'enzyme';
import InlineEditableTextfield from '../../InlineEditableTextfield';
import InlineEdit from '../../InlineEdit';
import InlineEditUncontrolled from '../../InlineEditUncontrolled';

import ContentWrapper from '../../../styled/ContentWrapper';
import EditButton from '../../../styled/EditButton';
import ReadViewContainer from '../../../styled/ReadViewContainer';
import ReadViewContentWrapper from '../../../styled/ReadViewContentWrapper';
import ReadViewWrapper from '../../../styled/ReadViewWrapper';

const noop = () => {};

describe('@atlaskit/inline-edit core', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should render a label when label prop is passed', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" label="test" />,
    );
    expect(wrapper.find('label').length).toBe(1);
  });

  it('should not render a label when label prop is not passed', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find('label').length).toBe(0);
  });

  it('should keep edit view open on blur when keepEditViewOpenOnBlur prop is true', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
        keepEditViewOpenOnBlur
      />,
    );
    const div = wrapper.find(ContentWrapper);
    div.simulate('blur');
    jest.runOnlyPendingTimers();
    expect(wrapper.find('input').length).toBe(1);
    expect(spy).not.toBeCalled();
  });

  it('should render action buttons', () => {
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    expect(wrapper.find('button').length).toBe(2);
  });

  it('should not render action buttons when hideActionButtons prop is true', () => {
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue=""
        startWithEditViewOpen
        hideActionButtons
      />,
    );
    expect(wrapper.find('button').length).toBe(0);
  });

  it('should stretch to container width in read mode if readViewFitContainerWidth prop is true', () => {
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue=""
        readViewFitContainerWidth
      />,
    );
    expect(wrapper.find(ReadViewContentWrapper)).toHaveStyleRule(
      'width',
      '100%',
    );
  });

  it('should display readView', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find(ReadViewContainer).length).toBe(1);
  });

  it('should render a button as a sibling to the read view', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find(ReadViewWrapper).find('button').length).toBe(1);
    expect(wrapper.find(ReadViewContentWrapper).find('button').length).toBe(0);
  });

  it('should display editView with correct initial value when isEditing prop is true', () => {
    /**
     * This test uses the startWithEditViewOpen prop to set the isEditing prop
     * to true within InlineEditableTextfield
     */
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue="test"
        startWithEditViewOpen
      />,
    );
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('input').prop('value')).toBe('test');
  });

  it('should switch to editView when the read view is clicked', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find(InlineEditUncontrolled).prop('isEditing')).toBe(false);
    wrapper.find(ReadViewContentWrapper).simulate('click');
    expect(wrapper.find(InlineEditUncontrolled).prop('isEditing')).toBe(true);
  });

  it('should switch to editView when the edit button is focused and enter is pressed', () => {
    /** This test uses simulate('click') to simulate a keydown of Enter on the edit button */
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    expect(wrapper.find(InlineEditUncontrolled).prop('isEditing')).toBe(false);
    wrapper.find(EditButton).simulate('click');
    expect(wrapper.find(InlineEditUncontrolled).prop('isEditing')).toBe(true);
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    expect(wrapper.find('button[type="submit"]').length).toBe(1);
    wrapper.find('form').simulate('submit');
    expect(spy).toBeCalled();
    expect(wrapper.find('input').length).toBe(0);
  });

  it('should cancel the edit and return to the initial value when cancel button is pressed', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    wrapper.find('input').simulate('change', { target: { value: 'Hello' } });
    wrapper.find('button[aria-label="Cancel"]').simulate('click');
    expect(wrapper.find(ReadViewContainer).length).toBe(1);
    expect(spy).not.toBeCalled();
    wrapper.find(EditButton).simulate('click');
    expect(wrapper.find('input').prop('value')).toBe('');
  });

  it('should cancel the edit and return to the initial value when Escape key is pressed', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Hello' } });
    input.simulate('keyDown', { key: 'Esc' });
    expect(wrapper.find(ReadViewContainer).length).toBe(1);
    expect(spy).not.toBeCalled();
    wrapper.find(EditButton).simulate('click');
    expect(wrapper.find('input').prop('value')).toBe('');
  });

  it('should call onConfirm on blur', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={spy}
        defaultValue=""
        startWithEditViewOpen
      />,
    );
    const div = wrapper.find(ContentWrapper);
    div.simulate('blur');
    jest.runOnlyPendingTimers();
    expect(spy).toBeCalled();
  });

  it('should have default aria tags', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="" />,
    );
    const button = wrapper.find(EditButton);
    expect(button.prop('aria-label')).toBe('Edit');
    button.simulate('click');
    expect(wrapper.find('button[aria-label="Confirm"]').length).toBe(1);
    expect(wrapper.find('button[aria-label="Cancel"]').length).toBe(1);
  });

  it('should pass through label props to aria tags', () => {
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue=""
        editButtonLabel="test-edit"
        confirmButtonLabel="test-confirm"
        cancelButtonLabel="test-cancel"
      />,
    );
    const button = wrapper.find(EditButton);
    expect(button.prop('aria-label')).toBe('test-edit');
    button.simulate('click');
    expect(wrapper.find('button[aria-label="test-confirm"]').length).toBe(1);
    expect(wrapper.find('button[aria-label="test-cancel"]').length).toBe(1);
  });

  // it('validation');
});

describe('@atlaskit/inline-editable-textfield', () => {
  it('should display emptyValueText when value is empty', () => {
    const wrapper = mount(
      <InlineEditableTextfield
        onConfirm={noop}
        defaultValue=""
        emptyValueText="test-empty-value"
      />,
    );
    expect(wrapper.find(ReadViewContentWrapper).text()).toBe(
      'test-empty-value',
    );
  });

  it('shows the correct value in the read view when not empty', () => {
    const wrapper = mount(
      <InlineEditableTextfield onConfirm={noop} defaultValue="test-value" />,
    );
    expect(wrapper.find(ReadViewContentWrapper).text()).toBe('test-value');
  });
});

describe('@atlaskit/inline-edit', () => {
  it('should render the component passed in via the readView prop', () => {
    const wrapper = mount(
      <InlineEdit
        onConfirm={noop}
        defaultValue=""
        readView={() => <div id="test" />}
        editView={() => <div />}
      />,
    );
    expect(wrapper.find('#test').length).toBe(1);
  });

  it('should render the component passed in via the editView prop', () => {
    const wrapper = mount(
      <InlineEdit
        onConfirm={noop}
        defaultValue=""
        readView={() => <div />}
        editView={() => <div id="test" />}
        startWithEditViewOpen
      />,
    );
    expect(wrapper.find('#test').length).toBe(1);
  });
});

describe('@atlaskit/inline-edit', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    (global.console.warn as jest.Mock).mockRestore();
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should mount without errors', () => {
    mount(<InlineEditableTextfield onConfirm={noop} defaultValue="" />);
    /* tslint:disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* tslint:disable no-console */
  });
});
