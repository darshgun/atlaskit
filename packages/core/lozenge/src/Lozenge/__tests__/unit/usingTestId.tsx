import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';

import Lozenge from '../../..';

describe('Using react-test-library', () => {
  describe('Lozenge should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const lozengeTestId = 'the-lozenge';
      const { getByTestId } = render(<Lozenge testId={lozengeTestId} />);
      expect(getByTestId(lozengeTestId)).toBeTruthy();
    });
  });
});
