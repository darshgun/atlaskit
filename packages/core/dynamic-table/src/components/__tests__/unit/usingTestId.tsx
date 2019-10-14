import React from 'react';
import { render } from '@testing-library/react';
import { DynamicTableStateless } from '../../../';

describe('Using testId', () => {
  it('Particular elements are accessible via data-testid', () => {
    const testId = 'the-table';

    const testIds = [
      `${testId}--container`,
      `${testId}--table`,
      `${testId}--table-head`,
      `${testId}--rankable-body`,
      `${testId}--body`,
    ];

    const { getByTestId } = render(<DynamicTableStateless testId={testId} />);

    testIds.forEach(testId => {
      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
