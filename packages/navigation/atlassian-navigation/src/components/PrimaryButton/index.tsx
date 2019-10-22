/** @jsx jsx */
import { jsx } from '@emotion/core';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { Fragment, forwardRef, Ref } from 'react';

import { useTheme } from '../../theme';
import { getPrimaryButtonTheme, isSelectedCSS } from './styles';
import { PrimaryButtonProps } from './types';

export const PrimaryButton = forwardRef(
  (props: PrimaryButtonProps, ref: Ref<any>) => {
    const { children, testId, tooltip, isSelected, ...buttonProps } = props;
    const theme = useTheme();

    const button = (
      <Fragment>
        <Button
          appearance="primary"
          data-testid={testId}
          ref={ref}
          theme={getPrimaryButtonTheme(theme)}
          {...buttonProps}
        >
          {children}
        </Button>
        {isSelected && <div css={isSelectedCSS(theme)} />}
      </Fragment>
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
