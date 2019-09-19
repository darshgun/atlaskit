import React from 'react';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

import { IconButton } from '../IconButton';
import { SettingsProps } from './types';

export const Settings = (props: SettingsProps) => {
  const { tooltip, ...iconButtonProps } = props;

  return (
    <IconButton
      icon={<SettingsIcon label={tooltip} />}
      tooltip={tooltip}
      {...iconButtonProps}
    />
  );
};
