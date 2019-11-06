/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import Popup from '@atlaskit/popup';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';
import { Notifications as NotificationsIframe } from '@atlaskit/atlassian-notifications';

import { Notifications } from '../../src';

const wrapperCSS = {
  width: 540,
  height: 'calc(100vh - 200px)',
  paddingTop: 18,
  paddingLeft: 18,
  display: 'flex',
};

const NotificationsContent = () => (
  <div css={wrapperCSS}>
    <NotificationsIframe
      // url="https://start.stg.atlassian.com/notificationsDrawer/iframe.html?scope=user&product=uchi&locale=en"
      _url="https://start.stg.atlassian.com/notificationsDrawer/iframe.html"
      locale="en"
      product="jira"
      testId="jira-notifications"
      title="Notifications"
    />
  </div>
);

class MockNotificationLogClient extends NotificationLogClient {
  constructor() {
    super('', '');
  }

  public async countUnseenNotifications() {
    return Promise.resolve({ count: 5 });
  }
}

const client = new MockNotificationLogClient();

export const NotificationsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLabel, setButtonLabel] = useState();

  const updateButtonLabel = ({ newCount }: { newCount: number }) => {
    setButtonLabel(newCount || 0);
  };

  const NotificationsBadge = () => (
    <NotificationIndicator
      onCountUpdated={updateButtonLabel}
      notificationLogProvider={Promise.resolve(client)}
    />
  );

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      placement="bottom-start"
      content={NotificationsContent}
      isOpen={isOpen}
      onClose={onClose}
      trigger={triggerProps => (
        <Notifications
          badge={NotificationsBadge}
          onClick={onClick}
          tooltip={`Notifications (${buttonLabel})`}
          {...triggerProps}
        />
      )}
    />
  );
};
