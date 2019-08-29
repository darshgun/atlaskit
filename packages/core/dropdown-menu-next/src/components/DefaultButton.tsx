import React from 'react';
import Button from '@atlaskit/button';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { DefaultButtonProps } from '../types';

export const DefaultButton: React.SFC<DefaultButtonProps> = React.forwardRef(
  ({ text, onClick }, ref) => {
    return (
      <Button
        onClick={onClick}
        ref={ref}
        iconAfter={<ExpandIcon label="expand" size="small" />}
      >
        {text}
      </Button>
    );
  },
);

export default DefaultButton;
