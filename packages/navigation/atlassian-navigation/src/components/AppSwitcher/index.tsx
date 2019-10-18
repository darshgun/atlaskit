import React from 'react';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import { IconButton } from '../IconButton';
import { AppSwitcherProps } from './types';

export const AppSwitcher = (props: AppSwitcherProps) => {
  const { tooltip, ...iconButtonProps } = props;

  return (
    <IconButton
      icon={<AppSwitcherIcon label={tooltip} />}
      tooltip={tooltip}
      shouldHaveLeftMargin={false}
      {...iconButtonProps}
    />
  );
};
