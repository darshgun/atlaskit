import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import cases from 'jest-in-case';

import Toggle from '../..';
import { Input } from '../../styled';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(<Toggle />);
    expect(wrapper).toBeDefined();
    expect(wrapper.find(Input).prop('data-testid')).toBeUndefined();
  });
  test('Toggle should be same with data-testid', () => {
    const wrapper = mount(<Toggle testId="my-spinner" />);
    expect(wrapper).toBeDefined();
    expect(wrapper.find(Input).prop('data-testid')).toBeDefined();
  });
  describe('Toggle data-testid should be stable and predictable', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(<Toggle testId={testId} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find(Input).prop('data-testid'));
      },
      [{ testId: 'AnY' }, { testId: '$%#%#()+_' }, { testId: '123;*&' }],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Toggle should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-spinner';
      const { getByTestId } = render(<Toggle testId={testId} />);
      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
