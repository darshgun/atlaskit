import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import React, { forwardRef, Ref } from 'react';

import { useTheme } from '../../theme';
import { getIconButtonTheme } from './styles';
import { IconButtonProps } from './types';

export const IconButton = forwardRef(
  (props: IconButtonProps, ref: Ref<any>) => {
    const { icon, testId, tooltip, ...buttonProps } = props;
    const theme = useTheme();

    return (
      <Tooltip content={tooltip} hideTooltipOnClick>
        <Button
          appearance="primary"
          data-testid={testId}
          iconBefore={icon}
          ref={ref}
          theme={getIconButtonTheme(theme)}
          {...buttonProps}
        />
      </Tooltip>
    );
  },
);
