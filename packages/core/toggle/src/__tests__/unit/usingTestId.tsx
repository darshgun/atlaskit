import React from 'react';
import { render } from '@testing-library/react';

import Toggle from '../..';
import { Label, Input } from '../../styled';

describe('Using react-test-library', () => {
  describe('Toggle should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-toggle';
      const testIdInput = 'the-toggle--input';
      const { getByTestId } = render(<Toggle testId={testId} />);
      expect(getByTestId(testId)).toBeTruthy();
      expect(getByTestId(testIdInput)).toBeTruthy();
    });
  });
});
