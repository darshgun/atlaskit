import React from 'react';
import { Reset, ResetTheme } from '../src';

export default () => (
  <ResetTheme.Provider
    // TODO look into whether there's a way to avoid placing curly braces
    value={t => ({ ...t({}), backgroundColor: '#333', textColor: '#eee' })}
  >
    <Reset style={{ padding: 10 }}>You can also theme a reset.</Reset>
  </ResetTheme.Provider>
);
