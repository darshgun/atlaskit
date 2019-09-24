// @flow

// $FlowFixMe - ts module and relative import?
import Navigation from '@atlaskit/atlassian-navigation/examples/10-authenticated-example';
import { NavigationSkeleton } from '@atlaskit/atlassian-navigation/skeleton';
import { ToggleStateless } from '@atlaskit/toggle';
import React, { Component, type ComponentType, type Node } from 'react';

import { LayoutManagerWithViewController, NavigationProvider } from '../src';

const customComponents = {};

const containerCSS = {
  margin: '1rem',
};

const labelCSS = {
  alignItems: 'center',
  display: 'flex',
};

type AppProps = {|
  children: Node,
  globalNavigation: ComponentType<{}>,
|};

const Layout = ({ children, globalNavigation }: AppProps) => (
  <NavigationProvider>
    <LayoutManagerWithViewController
      customComponents={customComponents}
      experimental_horizontalGlobalNav
      globalNavigation={globalNavigation}
    >
      <div css={containerCSS}>{children}</div>
    </LayoutManagerWithViewController>
  </NavigationProvider>
);

class ExperimentalAppNavigationDynamicUpdate extends Component<
  {||},
  {| showSkeleton: boolean |},
> {
  state = {
    showSkeleton: true,
  };

  render() {
    const { showSkeleton } = this.state;

    const onChange = () => {
      this.setState({ showSkeleton: !showSkeleton });
    };

    return (
      <Layout globalNavigation={showSkeleton ? NavigationSkeleton : Navigation}>
        <label css={labelCSS}>
          <ToggleStateless
            isChecked={showSkeleton}
            name="toggle"
            onChange={onChange}
          />
          <span>Toggle navigation</span>
        </label>
      </Layout>
    );
  }
}

export default ExperimentalAppNavigationDynamicUpdate;
