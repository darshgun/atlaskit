import React, { ReactChild } from 'react';
import Button from '@atlaskit/button';

interface Props {
  onClick?: () => void;
  children?: ReactChild;
}

export default (props: Props) => (
  <Button
    appearance="subtle"
    onClick={props.onClick}
    spacing="none"
    tabIndex={-1}
    iconBefore={props.children}
  />
);
