import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  const onChange = (value: unknown) => {
    console.log(value);
  };

  return (
    <div>
      <h3>Date picker</h3>
      <Label htmlFor="react-select-datepicker-1--input" label="default" />
      <DatePicker id="datepicker-1" onChange={onChange} testId={'datePicker'} />

      <h3>Time picker</h3>
      <Label htmlFor="react-select-timepicker-1--input" label="default" />
      <TimePicker
        id="timepicker-1"
        onChange={onChange}
        selectProps={{ classNamePrefix: 'timepicker-select' }}
        testId={'timePicker'}
      />

      <h3>Date / time picker</h3>
      <Label htmlFor="react-select-datetimepicker-1--input" label="default" />
      <DateTimePicker
        id="datetimepicker-1"
        onChange={onChange}
        testId={'dateTimePicker'}
      />
    </div>
  );
};
