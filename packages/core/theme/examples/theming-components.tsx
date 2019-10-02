import React, { Component, Fragment } from 'react';
import { createTheme, ThemeProp } from '../src';
import { ThemeProps, ThemedValue } from '../src/types';

interface LocalThemeProps {
  hover: boolean;
}

interface ThemeTokens {
  backgroundColor: string;
  textColor: string;
}

const defaultButtonTheme = (props: LocalThemeProps) => ({
  backgroundColor: props.hover ? '#ddd' : '#eee',
  textColor: '#333',
});

// TODO look into whether ThemedValue should be used here
const contextButtonTheme = (theme: ThemedValue, props: LocalThemeProps) => {
  return {
    ...(theme(props) as Object),
    backgroundColor: props.hover ? 'rebeccapurple' : 'palevioletred',
    textColor: props.hover ? '#fff' : 'papayawhip',
  };
};

const propButtonTheme = (theme: ThemedValue, props: LocalThemeProps) => ({
  ...(theme(props) as Object),
  backgroundColor: props.hover ? 'palevioletred' : 'rebeccapurple',
});

const Theme = createTheme<ThemeTokens, LocalThemeProps>(defaultButtonTheme);

interface Props {
  children?: Node;
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
}

interface State {
  hover: boolean;
}

class Button extends Component<Props, State> {
  state = {
    hover: false,
  };

  onMouseEnter = () => this.setState({ hover: true });

  onMouseLeave = () => this.setState({ hover: false });

  render() {
    return (
      <Theme.Provider value={this.props.theme}>
        <Theme.Consumer hover={this.state.hover}>
          {tokens => {
            const { backgroundColor, textColor: color } = tokens;
            return (
              <button
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                style={{
                  backgroundColor,
                  border: 0,
                  borderRadius: 3,
                  color,
                  cursor: 'pointer',
                  marginBottom: 10,
                  marginRight: 10,
                  padding: 10,
                }}
                type="button"
              >
                {this.props.children}
              </button>
            );
          }}
        </Theme.Consumer>
      </Theme.Provider>
    );
  }
}

// TODO fix children issue and replace fragment
export default () => (
  <Fragment>
    <Button>Default</Button>
    <Theme.Provider value={contextButtonTheme}>
      <Button>Context</Button>
      <Button theme={propButtonTheme}>Custom</Button>
    </Theme.Provider>
  </Fragment>
);
