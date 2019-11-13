import React from 'react';
import { createMemoryHistory, MemoryHistoryBuildOptions } from 'history';

import { Router } from '../router';
import { MemoryRouterProps } from './types';
import { RouterProps } from '../router/types';

const getRouterProps = (memoryRouterProps: MemoryRouterProps) => {
  const {
    isStatic = false,
    routes,
    resourceData,
    resourceContext,
    transitionBlocker,
  } = memoryRouterProps;
  let routerProps: Partial<RouterProps> = {
    routes,
    isStatic,
    transitionBlocker,
  };

  if (resourceData) {
    routerProps = { ...routerProps, resourceData };
  }

  if (resourceContext) {
    routerProps = { ...routerProps, resourceContext };
  }

  return routerProps;
};

/**
 * Ensures the router store uses memory history.
 *
 */
export const MemoryRouter = (props: MemoryRouterProps) => {
  const { location, children } = props;
  const config: MemoryHistoryBuildOptions = {};

  if (location) {
    config.initialEntries = [location];
  }

  const history = createMemoryHistory(config);
  const routerProps = getRouterProps(props);

  return (
    <Router history={history} {...routerProps}>
      {children}
    </Router>
  );
};

export { MemoryRouterProps };
