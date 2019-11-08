import React, { forwardRef, Ref } from 'react';
import NotificationIcon from '@atlaskit/icon/glyph/notification';

import { BadgeContainer, NOTIFICATIONS_BADGE_ID } from '../BadgeContainer';
import { IconButton } from '../IconButton';
import { NotificationsProps } from './types';

export const Notifications = forwardRef(
  (props: NotificationsProps, ref: Ref<any>) => {
    const { badge, tooltip, ...iconButtonProps } = props;

    return (
      <BadgeContainer badge={badge}>
        <IconButton
          icon={<NotificationIcon label={tooltip} />}
          tooltip={tooltip}
          ref={ref}
          aria-describedby={NOTIFICATIONS_BADGE_ID}
          {...iconButtonProps}
        />
      </BadgeContainer>
    );
  },
);
