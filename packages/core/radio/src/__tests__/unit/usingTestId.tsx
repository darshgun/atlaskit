import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import RadioGroup from '../../RadioGroup';
import { OptionsPropType } from '../../types';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const options: OptionsPropType = [
      { name: 'color', value: 'red', label: 'Red' },
      { name: 'color', value: 'blue', label: 'Blue' },
    ];
    const wrapper = mount(<RadioGroup options={options} />);
    expect(wrapper.find(`[data-testid]`).hostNodes()).toHaveLength(0);
  });

  test('Radio data-testid should be stable and predictable', () => {
    const options: OptionsPropType = [
      { name: 'color', value: 'red', label: 'Red', testId: 'red' },
      { name: 'color', value: 'blue', label: 'Blue', testId: 'blue' },
      { name: 'color', value: 'yellow', label: 'Yellow', testId: 'yellow' },
      { name: 'color', value: 'green', label: 'Green', testId: 'green' },
      { name: 'color', value: 'black', label: 'Black', testId: 'black' },
    ];
    const wrapper = mount(<RadioGroup options={options} />);

    options.forEach(({ testId }) => {
      expect(
        wrapper.find(`[data-testid='${testId}--radio-label']`).hostNodes(),
      ).toHaveLength(1);
      expect(
        wrapper.find(`[data-testid='${testId}--hidden-radio']`).hostNodes(),
      ).toHaveLength(1);
    });
  });
});

describe('Using react-test-library', () => {
  describe('Radio should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const options: OptionsPropType = [
        { name: 'color', value: 'red', label: 'Red', testId: 'red' },
        { name: 'color', value: 'blue', label: 'Blue', testId: 'blue' },
      ];

      const { getByTestId } = render(<RadioGroup options={options} />);

      options.forEach(({ testId }) => {
        const radio = getByTestId(
          (testId as string) + '--hidden-radio',
        ) as HTMLInputElement;
        const label = getByTestId((testId as string) + '--radio-label');
        expect(radio.checked).toBeFalsy();
        label.click();
        expect(radio.checked).toBeTruthy();
      });
    });
  });
});
