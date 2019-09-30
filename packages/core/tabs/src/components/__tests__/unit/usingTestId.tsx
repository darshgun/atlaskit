import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import Tabs from '../../../components/Tabs';

const tabs = [
  { label: 'Tab 1', content: <p>One</p> },
  { label: 'Tab 2', content: <p>Two</p> },
  { label: 'Tab 3', content: <p>Three</p> },
  { label: 'Tab 4', content: <p>Four</p> },
];

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(<Tabs tabs={tabs} />);
    expect(wrapper).toBeDefined();
    expect(wrapper.find(`[data-testid]`).hostNodes()).toHaveLength(0);
  });

  describe('Textarea data-testid should be stable and predictable', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(<Tabs tabs={tabs} testId={testId} />);
        expect(
          wrapper.find(`[data-testid='${testId}']`).hostNodes(),
        ).toHaveLength(1);
      },
      [{ testId: 'AnY' }, { testId: '$%#%#()+_' }, { testId: '123;*&' }],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Textarea should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-textarea';
      const { getByTestId } = render(<Tabs tabs={tabs} testId={testId} />);

      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
