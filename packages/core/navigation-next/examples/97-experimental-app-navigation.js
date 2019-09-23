// @flow

import React from 'react';

import { Route, Switch } from 'react-router';
import { MemoryRouter } from 'react-router-dom';

import { LayoutManagerWithViewController, NavigationProvider } from '../src';

import { DummySkeletonContent } from './shared/components/DummySkeletonContent';
import { LinkItem, ProjectSwitcher } from './shared/components';
import RootViews from './shared/views/root';
import ContainerViews from './shared/views/container';
import AtlassianNavigation from './shared/components/AtlassianNavigation';

import { routes } from './shared/routes';

const containerStyle = {
  padding: 40,
};

const customComponents = {
  LinkItem,
  ProjectSwitcher,
};

const HorizontalNavigationApp = () => {
  return (
    <MemoryRouter>
      <NavigationProvider>
        <LayoutManagerWithViewController
          customComponents={customComponents}
          experimental_flyoutOnHover
          experimental_alternateFlyoutBehaviour
          experimental_horizontalGlobalNav
          globalNavigation={AtlassianNavigation}
        >
          <div style={containerStyle}>
            <RootViews />
            <ContainerViews />
            <Switch>
              {routes.map(({ component, path }) => (
                <Route key={path} component={component} path={path} />
              ))}
            </Switch>
            <DummySkeletonContent />
          </div>
        </LayoutManagerWithViewController>
      </NavigationProvider>
    </MemoryRouter>
  );
};

export default HorizontalNavigationApp;
