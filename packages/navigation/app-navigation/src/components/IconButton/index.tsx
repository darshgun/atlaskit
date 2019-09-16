/** @jsx jsx */
import { jsx } from '@emotion/core';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';

import { useTheme } from '../../theme';
import { getIconButtonTheme } from './styles';
import { IconButtonProps } from './types';

export const IconButton = ({
  className = '',
  icon,
  onClick,
  testId = 'NavigationItem',
  tooltip,
}: IconButtonProps) => {
  const theme = useTheme();

  return (
    <Tooltip content={tooltip}>
      <Button
        appearance="primary"
        data-test-id={testId}
        className={className}
        iconBefore={icon}
        onClick={onClick}
        theme={getIconButtonTheme(theme)}
      />
    </Tooltip>
  );
};
