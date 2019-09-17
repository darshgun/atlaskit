import React from 'react';
import { Settings } from '../../src';

const onClick = (...args: any[]) => {
  console.log('settings click', ...args);
};

export const DefaultSettings = () => (
  <Settings onClick={onClick} tooltip="Settings" />
);
