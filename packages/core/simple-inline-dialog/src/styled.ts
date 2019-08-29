import styled from '@emotion/styled';
import { borderRadius, colors, layers } from '@atlaskit/theme';
import { fullStyledMenu } from './types';

const shadow = colors.N40A;

export const StyledMenu = styled('div')<fullStyledMenu>`
  background-color: ${colors.N0};
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 0 1px ${shadow}, 0 4px 11px ${shadow};
  z-index: ${layers.layer()};
  min-width: ${props => props.minWidth};
  max-width: ${props => props.maxWidth};
`;
