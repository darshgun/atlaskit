import React from 'react';
import { Checkbox } from '../src';

export default () => {
  const formRef = useRef(null);
  const [data, setData] = useState('');
  return (
    <>
      Press [tab] fam
      <Checkbox
        value="trivialities"
        label="Focused second!"
        overrides={{
          HiddenCheckbox: {
            attributesFn: () => ({
              tabIndex: 2,
            }),
          },
        }}
      />
      <Checkbox
        value="trivialities"
        label="Focused first!"
        overrides={{
          HiddenCheckbox: {
            attributesFn: () => ({
              tabIndex: 1,
              'data-test-id': 'test-checkbox',
            }),
          },
        }}
      />
    </>
  );
};
