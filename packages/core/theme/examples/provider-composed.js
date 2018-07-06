// @flow

import React from 'react';
import color from 'color';
import { Consumer, Provider } from '../src';

const DisplayThemeColors = () => (
  <Consumer>
    {theme =>
      Object.keys(theme).map(k => (
        <div
          style={{
            backgroundColor: theme[k],
            color: color(theme[k]).negate(),
            display: 'inline-block',
            marginRight: 10,
            padding: 10,
          }}
        >
          {k}
        </div>
      ))
    }
  </Consumer>
);

export default () => (
  <Provider backgroundColor="#333" textColor="#eee">
    <DisplayThemeColors />
    <Provider backgroundColor="palevioletred">
      <DisplayThemeColors />
    </Provider>
  </Provider>
);
