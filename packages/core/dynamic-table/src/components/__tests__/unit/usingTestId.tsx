import React from 'react';
import { render } from '@testing-library/react';
import { DynamicTableStateless } from '../../../';
import { head, rows } from '../../../../examples/content/sample-data';

describe('Using testId', () => {
  test('Particular elements are accessible via data-testid', () => {
    const testId = 'the-table';

    const testIds = [`${testId}--table`, `${testId}--head`, `${testId}--body`];

    const { getByTestId, getAllByTestId } = render(
      <DynamicTableStateless head={head} rows={rows} testId={testId} />,
    );

    testIds.forEach(testId => {
      expect(getByTestId(testId)).toBeTruthy();
    });

    const multipleTestIds = [
      `${testId}--head--cell`,
      `${testId}--body--cell-0`,
      `${testId}--body--cell-1`,
      `${testId}--body--cell-2`,
      `${testId}--body--cell-3`,
      `${testId}--body--cell-4`,
    ];

    multipleTestIds.forEach(testId => {
      expect(getAllByTestId(testId)).toBeTruthy();
    });
  });
});
