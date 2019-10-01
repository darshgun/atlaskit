import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import cases from 'jest-in-case';

import Spinner from '../..';
import Container from '../../styledContainer';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(<Spinner />);
    expect(wrapper).toBeDefined();
    expect(wrapper.find(Container).exists()).toBe(true);
    expect(wrapper.find(Container).prop('data-testid')).toBeUndefined();
  });
  test('Spinner should be same with data-testid', () => {
    const wrapper = mount(<Spinner testId="my-spinner" />);
    expect(wrapper).toBeDefined();
    expect(wrapper.find(Container).exists()).toBe(true);
    expect(wrapper.find(Container).prop('data-testid')).toBeDefined();
  });
  describe('Spinner data-testid should be stable and predictable', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(<Spinner testId={testId} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find(Container).exists()).toBe(true);
        expect(wrapper.find(Container).prop('data-testid')).toBeDefined();
      },
      [{ testId: 'AnY' }, { testId: '$%#%#()+_' }, { testId: '123;*&' }],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Spinner should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-spinner';
      const { getByTestId } = render(<Spinner testId={testId} />);
      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
