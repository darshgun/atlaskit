import React from 'react';
import styled from 'styled-components';
import { borderRadius, colors, layers, elevation } from '@atlaskit/theme';
import { fullStyledMenu } from '../types';

export const StyledMenu = styled('div')<fullStyledMenu>`
  padding: 8px 12px;
  background-color: ${colors.N20};
  border-radius: ${borderRadius()}px;
  z-index: ${layers.dialog};
  ${elevation.e200};
  ${props => (props.shouldFitContainer ? 'max-width: 300px' : '')};
`;
