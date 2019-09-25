import { mount } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import Checkbox from '../../Checkbox';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(
      <Checkbox
        value="Basic checkbox"
        label="Basic checkbox"
        name="checkbox-basic"
      />,
    );
    expect(wrapper.find(`[data-testid]`).hostNodes()).toHaveLength(0);
  });

  describe('Checkbox data-testid should be stable and predictable', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(
          <Checkbox
            value="Basic checkbox"
            label="Basic checkbox"
            name="checkbox-basic"
            testId={testId}
          />,
        );
        expect(
          wrapper.find(`[data-testid='${testId}']`).hostNodes(),
        ).toHaveLength(1);
      },
      [
        { testId: 'any' },
        { testId: 'string' },
        { testId: 'will' },
        { testId: 'work' },
      ],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Checkbox should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-checkbox';
      const { getByTestId } = render(
        <Checkbox
          value="Basic checkbox"
          label="Basic checkbox"
          name="checkbox-basic"
          testId={testId}
        />,
      );

      const checkbox = getByTestId(testId) as HTMLInputElement;
      expect(checkbox.checked).toBeFalsy();
      checkbox.click();
      expect(checkbox.checked).toBeTruthy();
    });
  });
});
