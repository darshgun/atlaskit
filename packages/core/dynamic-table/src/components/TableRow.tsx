import React from 'react';
import { TableBodyRow } from '../styled/TableRow';
import { TableBodyCell } from '../styled/TableCell';
import { HeadType, RowType } from '../types';

interface Props {
  head?: HeadType;
  isFixedSize: boolean;
  isHighlighted?: boolean;
  row: RowType;
  testId?: string;
}

const Row = ({ row, head, isFixedSize, isHighlighted }: Props) => {
  const { cells, testId, ...restRowProps } = row;
  return (
    <TableBodyRow {...restRowProps} isHighlighted={isHighlighted}>
      {cells.map((cell, cellIndex) => {
        const { content, testId, ...restCellProps } = cell;
        const { shouldTruncate, width } =
          (head || { cells: [] }).cells[cellIndex] || ({} as any);
        console.log('cell', cell);
        return (
          <TableBodyCell
            data-testid={testId && `${testId}--${content}-cell`}
            {...restCellProps}
            isFixedSize={isFixedSize}
            key={cellIndex} // eslint-disable-line react/no-array-index-key
            shouldTruncate={shouldTruncate}
            width={width}
          >
            {content}
          </TableBodyCell>
        );
      })}
    </TableBodyRow>
  );
};

export default Row;
