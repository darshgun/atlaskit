import React from 'react';

import { AppSwitcher } from '../../src';

const onClick = (...args: any[]) => {
  console.log('app switcher click', ...args);
};

export const DefaultAppSwitcher = () => (
  <AppSwitcher onClick={onClick} tooltip="Switch to..." />
);
