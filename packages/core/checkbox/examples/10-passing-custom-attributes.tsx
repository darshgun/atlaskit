import React from 'react';
import { Checkbox } from '../src';

export default () => (
  <form id="lovely-form" onSubmit={e => console.log(e)}>
    <Checkbox
      label="Associating a form and adding a testid!"
      overrides={{
        Label: {
          attributesFn: () => ({
            form: 'lovely-form',
            'data-test-id': 'test-checkbox',
          }),
        },
      }}
    />
  </form>
);
