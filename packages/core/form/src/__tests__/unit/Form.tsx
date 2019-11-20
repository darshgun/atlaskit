import React, { useCallback, useState } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import TextField from '@atlaskit/textfield';
import { act } from 'react-test-renderer';
import Form from '../../Form';
import Field from '../../Field';

describe('Form', () => {
  const submitForm = (wrapper: ReactWrapper<any>) => {
    wrapper.find('form').simulate('submit');
  };

  test('should update the onSubmit prop when it was updated', () => {
    // eslint-disable-next-line react/prop-types
    const MyFormComponent = (props: { onFormSubmit: (value: any) => void }) => {
      const { onFormSubmit } = props;
      const [myValue, setMyValue] = useState<string | null>(null);

      const handleSubmit = useCallback(() => {
        onFormSubmit(myValue);
      }, [myValue, onFormSubmit]);

      return (
        <Form onSubmit={handleSubmit}>
          {({ formProps }) => (
            <form {...formProps}>
              <Field name="my-field" label="My Field" defaultValue="">
                {({ fieldProps }) => (
                  <TextField
                    {...fieldProps}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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

    act(() => {
      wrapper.find('input[name="my-field"]').simulate('change', {
        target: {
          value: 'foo',
        },
      });
      submitForm(wrapper);
    });

    expect(myOnSubmit).toHaveBeenCalledWith('foo');
  });
});
