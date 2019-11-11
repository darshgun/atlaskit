# Router configuration

In Jira we use the `StaticRouter` in SSR, and the `Router` on the client.

## Basic configuration

```js
// entry.js

import { getTenantContext } from 'common/utils';
import { Router, createHistory } from 'spa-router';

import { App } from 'spa';
import { routes } from 'spa/routes';

const tenantContext = getTenantContext();
const appRoutes = routes(tenantContext.baseUrl);
const resourceContext = { tenantContext };
const history = createHistory();

// Use this client side, it listens to history changes
export const AppRouter = () => (
  <Router
    routes={appRoutes}
    history={history}
    resourceContext={resourceContext}
  >
    <App />     
  </Router>
);
```

## Static Router

```js
// entry-ssr.js

import { getTenantContext } from 'common/utils';
import { StaticRouter } from 'spa-router';

import { SpaApp } from 'spa';
import { routes } from 'spa/routes';

const tenantContext = getTenantContext();
const allRoutes = routes(tenantContext.baseUrl);
const resourceContext = { tenantContext };
const ssrLocation = '/';

// Use this server side, it does not listen to history changes
export const AppRouter = () => (
  <StaticRouter
    location={ssrLocation}
    routes={allRoutes}
    resourceContext={resourceContext}
  >
    <SpaApp />
  </StaticRouter>
);
```

## Memory Router

```js
import { MemoryRouter, RouteSubscriber } from 'spa-router';

import { App } from 'spa';

const tenantContext = { baseUrl: '' };
const routes = [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: App,
  },
];
const resourceContext = { tenantContext };

export const MemoryRouterExample = () => (
  <MemoryRouter
    location="/test"
    routes={routes}
    resourceContext={resourceContext}
  >
    <RouteSubscriber>
      {routerState => <routerState.route.component {...routerState} />}
    </RouteSubscriber>
  </MemoryRouter>
);
```
