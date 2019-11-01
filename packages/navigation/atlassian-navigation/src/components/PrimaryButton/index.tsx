/** @jsx jsx */
import { jsx } from '@emotion/core';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { forwardRef, Ref } from 'react';

import { useTheme } from '../../theme';
import { getPrimaryButtonTheme, isSelectedCSS } from './styles';
import { PrimaryButtonProps } from './types';

export const PrimaryButton = forwardRef(
  (props: PrimaryButtonProps, ref: Ref<any>) => {
    const { children, testId, tooltip, isHighlighted, ...buttonProps } = props;
    const theme = useTheme();

    const button = (
      <div css={isSelectedCSS(theme, isHighlighted)}>
        <Button
          appearance="primary"
          data-testid={testId}
          ref={ref}
          theme={getPrimaryButtonTheme(theme)}
          {...buttonProps}
        >
          {children}
        </Button>
      </div>
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
