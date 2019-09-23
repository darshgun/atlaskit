// @flow
// $FlowFixMe
import React, { useCallback, useState } from 'react';
import { mount } from 'enzyme';
import TextField from '@atlaskit/textfield';
import { act } from 'react-test-renderer';
import Form from '../../Form';
import Field from '../../Field';

describe('Form', () => {
  const submitForm = wrapper => {
    wrapper.find('form').simulate('submit');
  };

  test('should update the onSubmit prop when it was updated', () => {
    // eslint-disable-next-line react/prop-types
    const MyFormComponent = ({ onFormSubmit }) => {
      const [myValue, setMyValue] = useState(null);

      const handleSubbmit = useCallback(
        () => {
          onFormSubmit(myValue);
        },
        [myValue, onFormSubmit],
      );

      return (
        <Form onSubmit={handleSubbmit}>
          {({ formProps }) => (
            <form {...formProps}>
              <Field name="my-field" label="My Field" defaultValue="">
                {({ fieldProps }) => (
                  <TextField
                    {...fieldProps}
                    onChange={event => {
                      setMyValue(event.target.value);
                    }}
                  />
                )}
              </Field>
            </form>
          )}
        </Form>
      );
    };

    const myOnSubmit = jest.fn();
    const wrapper = mount(<MyFormComponent onFormSubmit={myOnSubmit} />);

    // when
    act(() => {
      wrapper.find('input[name="my-field"]').simulate('change', {
        target: {
          value: 'foo',
        },
      });
      submitForm(wrapper);
    });

    // then
    expect(myOnSubmit).toHaveBeenCalledWith('foo');
  });
});
