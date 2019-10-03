import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';

import Lozenge from '../../..';

describe('Using enzyme', () => {
  test('Lozenge > it should not generate data-testid', () => {
    const wrapper = mount(<Lozenge />);
    expect(wrapper).toBeDefined();
    expect(wrapper.html()).not.toContain('data-testid');
  });

  test('Lozenge > it should have data-testid ', () => {
    const wrapper = mount(<Lozenge testId="the-lozenge" />);
    expect(wrapper.html()).toContain('data-testid="the-lozenge"');
  });

  describe('Lozenge with different data-testid', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(<Lozenge testId={testId} />);
        expect(wrapper.html()).toContain(`data-testid="${testId}"`);
      },
      [
        { testId: 'josefGiTan' },
        { testId: 'ZZZZŹŽ;;;;' },
        { testId: '126^^^' },
      ],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Lozenge should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const lozengeTestId = 'the-lozenge';
      const { getByTestId } = render(<Lozenge testId={lozengeTestId} />);
      expect(getByTestId(lozengeTestId)).toBeTruthy();
    });
  });
});
