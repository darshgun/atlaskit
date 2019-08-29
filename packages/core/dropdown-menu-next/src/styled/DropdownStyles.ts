import React from 'react';
import styled from 'styled-components';
import { borderRadius, colors, layers, elevation } from '@atlaskit/theme';
import { fullStyledMenu } from '../types';

const shadow = colors.N40A;

export const StyledMenu = styled('div')<fullStyledMenu>`
  background-color: 'white';
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 0 1px ${shadow}, 0 4px 11px ${shadow};
  z-index: ${layers.layer()};
  min-width: ${props => props.minWidth};
  max-width: ${props => props.maxWidth};
`;
