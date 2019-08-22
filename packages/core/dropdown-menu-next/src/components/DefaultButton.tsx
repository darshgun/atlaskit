import React from 'react';
import Button from '@atlaskit/button';
import { DefaultButtonProps } from '../types';

export const DefaultButton: React.SFC<DefaultButtonProps> = React.forwardRef(
  ({ text, onClick }, ref) => {
    return (
      <Button onClick={onClick} ref={ref}>
        {text}
      </Button>
    );
  },
);

export default DefaultButton;
