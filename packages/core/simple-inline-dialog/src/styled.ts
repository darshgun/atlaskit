import styled from '@emotion/styled';
import { borderRadius, layers } from '@atlaskit/theme/constants';
import { N0, N40A } from '@atlaskit/theme/colors';
import { fullStyledMenu } from './types';

const shadow = N40A;

export const StyledMenu = styled('div')<fullStyledMenu>`
  background-color: ${N0};
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 0 1px ${shadow}, 0 4px 11px ${shadow};
  z-index: ${layers.layer()};
  min-width: ${props => props.minWidth};
  max-width: ${props => props.maxWidth};
  min-height: ${props => props.minHeight};
  max-height: ${props => props.maxHeight};
  box-sizing: border-box;
  overflow: ${props => props.overflow};
  display: inline-flex;
  ${props =>
    props.shouldFitContainer &&
    `
    display: block;
    flex: 1 1 auto;
  `};
`;

export const MenuRelContainer = styled.div`
  position: relative;
`;
