import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import React, { forwardRef, Ref } from 'react';

import { useTheme } from '../../theme';
import { getPrimaryButtonTheme } from './styles';
import { PrimaryButtonProps } from './types';

export const PrimaryButton = forwardRef(
  (props: PrimaryButtonProps, ref: Ref<any>) => {
    const { children, testId, tooltip, ...buttonProps } = props;
    const theme = useTheme();

    const button = (
      <Button
        appearance="primary"
        data-testid={testId}
        ref={ref}
        theme={getPrimaryButtonTheme(theme)}
        {...buttonProps}
      >
        {children}
      </Button>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} hideTooltipOnClick>
          {button}
        </Tooltip>
      );
    }

    return button;
  },
);
