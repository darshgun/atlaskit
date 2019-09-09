import React from 'react';
import NotificationIcon from '@atlaskit/icon/glyph/notification';

import { BadgeContainer } from '../BadgeContainer';
import { IconButton } from '../IconButton';
import { NotificationsProps } from './types';

export const Notifications = (props: NotificationsProps) => {
  const { badge, tooltip, ...iconButtonProps } = props;

  return (
    <BadgeContainer badge={badge}>
      <IconButton
        icon={<NotificationIcon label={tooltip} />}
        tooltip={tooltip}
        {...iconButtonProps}
      />
    </BadgeContainer>
  );
};
