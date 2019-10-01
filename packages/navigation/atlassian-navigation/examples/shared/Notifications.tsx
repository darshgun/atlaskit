import Badge from '@atlaskit/badge';
import React from 'react';

import { Notifications } from '../../src';

const onClick = (...args: any[]) => {
  console.log('notifications click', ...args);
};

const badge = () => <Badge appearance="important">3</Badge>;

export const DefaultNotifications = () => (
  <Notifications badge={badge} onClick={onClick} tooltip="Notifications" />
);
