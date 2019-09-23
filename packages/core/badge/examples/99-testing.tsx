import React from 'react';
import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';
import Badge from '../src';

interface ItemProps {
  inverted?: boolean;
}

const Item = styled.div<ItemProps>`
  align-items: center;
  background: ${props => (props.inverted ? colors.B400 : 'none')};
  border-radius: ${borderRadius}px;
  color: ${props => (props.inverted ? colors.N0 : 'inherit')};
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  max-width: 300px;
  padding: 0.6em 1em;

  &:hover {
    background-color: ${props => (props.inverted ? colors.B500 : colors.N20)};
  }
`;

export default function Example() {
  return (
    <div>
      <Item>
        <p>Added</p>
        <Badge appearance="added" max={99} testId="myBadge">
          {3000}
        </Badge>
      </Item>
    </div>
  );
}
