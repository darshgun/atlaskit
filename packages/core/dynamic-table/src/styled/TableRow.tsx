import styled from 'styled-components';
import { row } from '../theme';

export interface ITableRowProps {
  isHighlighted?: boolean;
}

export const TableBodyRow = styled.tr<ITableRowProps>`
  background: ${props =>
    props.isHighlighted ? row.highlightedBackground : 'inherit'};
  &:hover {
    background: ${row.hoverBackground};
  }
`;
