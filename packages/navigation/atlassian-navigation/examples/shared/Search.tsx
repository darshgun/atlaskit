import React from 'react';

import { Search } from '../../src';

const onClick = (...args: any[]) => {
  console.log('search click', ...args);
};

export const DefaultSearch = () => (
  <Search onClick={onClick} text="Search..." tooltip="Search" />
);
