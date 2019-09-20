import React from 'react';

import { Help } from '../../src';

const onClick = (...args: any[]) => {
  console.log('help click', ...args);
};

export const DefaultHelp = () => <Help onClick={onClick} tooltip="Help" />;
