import React, { PureComponent } from 'react';
import { Checkbox } from '../src';

import { N40 } from '@atlaskit/theme/colors';
import merge from 'lodash.merge';

import IconIndeterminate from '@atlaskit/icon/glyph/add-circle';
import Icon from '@atlaskit/icon/glyph/check-circle';

import { ComponentTokens, ThemeTokens } from '../src/types';

// Customising the resting boxColor, so that we can actually see the new icon in a resting state
const newThemeTokens: ComponentTokens = {
  icon: {
    boxColor: {
      rest: N40,
    },
  },
};

interface State {
  onChangeResult: string;
}

const customTheme = (
  current: (props: { tokens: ComponentTokens; mode: string }) => ThemeTokens,
  props: { tokens: ComponentTokens; mode: string },
) => {
  const themeTokens = current(props);
  return merge({}, themeTokens, newThemeTokens);
};

const BasicUsageExample = class extends PureComponent<void, State> {
  state = {
    onChangeResult: 'Check & Uncheck to trigger onChange',
  };

  onChange = (event: any) => {
    this.setState({
      onChangeResult: `onChange called with value: ${
        event.target.value
      } isChecked: ${event.target.checked}`,
    });
  };

  render() {
    return (
      <div>
        <Checkbox
          value="Basic checkbox"
          label="Basic checkbox"
          onChange={this.onChange}
          name="checkbox-basic"
          testId="the-checkbox"
        />
        <Checkbox
          label="That's not a standard Icon!"
          theme={customTheme}
          overrides={{
            Icon: {
              // Adding a custom Icon component
              component: Icon,
            },
            IconIndeterminate: {
              // Adding a custom Icon component for the indeterminate state
              component: IconIndeterminate,
            },
          }}
          testId="the-custom-checkbox"
        />
      </div>
    );
  }
};

export default BasicUsageExample;
