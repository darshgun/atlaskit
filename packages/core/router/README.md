# SPA Router ↩️

The SPA router manages routing with a safe defensive API that unlocks performant SSR and hooks
support.

The router is driven by configuration and a pattern called **route resources**.

### More information:

- [Resources](./docs/resources.md)
- [Router](./docs/router.md)

## Configuring the router

A basic implementation of the router is not too far removed from other popular router libraries.

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

### Routes

Route configuration should be familiar if you have used `react-router`. There are only a few
"required" properties, along with a number of optional properties.

At the minimum, a working route should include the following properties:

| Property               | type                          | Description                                                                                                                          |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `path`                 | `string`                      | The path that will be matched for this route to render. The path can contain params which will be provided to the component on match |
| `component`            | `ComponentType<RouteContext>` | The component that will be rendered if the current location matches the path.                                                        |  |
| `resources` (optional) | `RouteResource[]`             | The resources that will be loaded for this route                                                                                     |

```js
const routes = [
  {
    path: `/projects/:projectKey`, // `projectKey` will be provided as `this.props.match.params.projectKey` to the component
    component: ProjectsDirectory,
    resources: [projectsDirectoryResource],
  },
];
```

#### RouteContext

These props are passed to the component that renders on a matched route.

```js
type RouteContext = {|
  location: Location,
  query: Query,
  route: Route | null,
  match: Match,
  action: HistoryAction,
|};
```

## What are route resources?

Route resources are configuation objects that are used by the router to retrieve, cache, and provide
data to the routes.

### Creating resources

Resources should always be created using the `createResource` helper function.

`createResource` takes in a configuration object that should contain the following properties.

| Property        | type                                                         | Description                                                                                                                                                                                                                                                                                                                          |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`          | `string`                                                     | Used as a namespace within the router store for this resource. For example a namespace for the boards resource would be 'boards'                                                                                                                                                                                                     |
| `getKey`        | `(routerStoreContext, resourceStoreContext) => string`       | This function is passed a `RouterStoreContext` and `ResourceStoreContext` and is used to identify this resource within the `type` namespace. For example for a boards you can simply return `routerStoreContext.match.params.boardId` here                                                                                           |
| `getData`       | `(routerStoreContext, resourceStoreContext) => Promise<any>` | This function is used to load the data for the resource. The function should return a promise and resolve with the resource data object. NOTE: You may not use `getData` and `getDataLoader` on the same resource                                                                                                                    |
| `maxAge`        | `number`                                                     | How long (in milliseconds) the resource should be kept in the router before a fresh resource is retrieved. Note: Resources are only refreshed on route _change_. The router does not poll or update resources in the background. Navigation within the same route, e.g. query param change, will not trigger a refresh of resources. |
| `getDataLoader` | `() => Promise<{default: getData}>`                          | Optional property that enables neater code splitting. See more below. NOTE: You may not use `getData` and `getDataLoader` on the same resource                                                                                                                                                                                       |

#### Code splitting

Code that is used to retrieve data can be asynchronously imported using the `getDataLoader` resource
property.

The module that is imported through `getDataLoader` must export a default property that is the
function we use to load data.

It is worth noting that you cannot have both `getData` and `getDataLoader` on the same resource.

#### Examples

Example of using `createResource` using `getData`:

```js
import { createResource } from 'spa-router';
import { ROUTE_RESOURCE_TYPE_DIRECTORIES_PROJECTS } from 'spa/routes/resources';
import { getProjectsDirectoryData } from 'spa-apps/projects-directory';

export const projectsDirectoryResource = createResource({
  type: ROUTE_RESOURCE_TYPE_DIRECTORIES_PROJECTS,
  getKey: (routerContext, resourceContext) => {
    const { match } = routerContext;
    const { tenantContext } = resourceContext;

    return match.params.id;
  },
  getData: async (routerContext, resourceContext) => {
    const { query } = routerContext;

    // Tenant context is always provided in the Jira SPA
    const {
      tenantContext: { baseUrl, isAdmin },
    } = resourceContext;

    return getProjectsDirectoryData(baseUrl, isAdmin, query);
  },
  maxAge: 30 * 1000,
});
```

Example of using `createResource` using `getDataLoader`:

```js
// data-loader.js

const loadMyData = async (routerContext, resourceContext) => {
  const { query } = routerContext;

  // Tenant context is always provided in the Jira SPA
  const {
    tenantContext: { baseUrl, isAdmin },
  } = resourceContext;

  return getProjectsDirectoryData(baseUrl, isAdmin, query);
};

export default loadMyData;

// resource.js

import { createResource } from 'spa-router';
import { ROUTE_RESOURCE_TYPE_DIRECTORIES_PROJECTS } from 'spa/routes/resources';
import { getProjectsDirectoryData } from 'spa-apps/projects-directory';

export const projectsDirectoryResource = createResource({
  type: ROUTE_RESOURCE_TYPE_DIRECTORIES_PROJECTS,
  getKey: (routerContext, resourceContext) => {
    const { match } = routerContext;
    const { tenantContext } = resourceContext;

    return match.params.id;
  },
  getDataLoader: () =>
    import(/* webpackChunkName: "async-projects-directory" */ './data-loader'),
  maxAge: 30 * 1000,
});
```

# Router configuration

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

# Accessing router state

You can access the current state of the router using the `useRouter` hook or the `RouterSubscriber`
component.

Both components provde both `routerState` for reading the current router state, and `routerActions`
for modifying router state.

```js
import type { Query, Route, Match, HistoryAction } from 'spa-router';

type RouterState = {
  location: Location,
  query: Query,
  route: Route,
  match: Match,
  action: HistoryAction,
};

type RouterActions = {|
  push: (path: Href | LocationShape, state?: any) => RouterAction,
  replace: (path: Href | LocationShape, state?: any) => RouterAction,
  goBack: () => RouterAction,
  goForward: () => RouterAction,
  registerBlock: (blocker: HistoryBlocker | any) => RouterAction,
|};
```

## RouterSubscriber component

```js
import { RouterSubscriber } from 'spa-router';

import { MyComponent } from 'my-component';

export const MyRouteComponent = () => (
  <RouterSubscriber>
    {(routerState, routerActions) => (
      <MyComponent location={routerState.location} push={routerActions.push} />
    )}
  </RouterSubscriber>
);
```

## useRouter hook

```js
import { useRouter, RouterSubscriber, withRouter } from 'spa-router';

export const MyRouteComponent = () => {
  const [routerState, routerActions] = useRouter();

  return (
    <MyComponent location={routerState.location} push={routerActions.push} />
  );
};
```

## withRouter HoC

The `withRouter` HoC can be used for decorating your component. It provides the following props to
its children.

| Prop     | Type           |
| -------- | -------------- |
| location | Location       |
| query    | Query          |
| route    | Route          |
| match    | Match          |
| action   | HistoryAction  |
| history  | BrowserHistory |

```js
import { withRouter } from 'spa-router';

export const WithRouterHocExample = withRouter(MyComponent);

const MyRouterComponent = () => {
  return <WithRouterHocExample />;
};
```

# Router Actions

Router Actions can be accessed through a dedicated hook or a dedicated subscriber.

Both the component and the hook have been optimised so that they will not re-render on URL change.

```js
type RouterActionsType = {
  push: (path: Href | Location, state?: any) => any,
  replace: (path: Href | Location, state?: any) => any,
  goBack: () => any,
  goForward: () => any,
  registerBlock: (blocker: Function) => () => void,
};
```

## Router Actions hook

Router actions can be accessed through a hook.

```js
import { useRouter, RouterActions, withRouter } from 'spa-router';
import { Href } from 'spa-router';
import { MyComponent } from 'my-component';

export const HooksExample = () => {
  const {
    push,
    replace,
    goBack,
    goForward,
    registerBlock,
  } = useRouterActions();

  return <MyComponent push={push} />;
};
```

### Router Actions subscriber

This component has been optimised so that it will not re-render on URL change.

```js
export const RenderPropsExample = () => (
  <RouterActions>
    {routerActions => <MyComponent push={routerActions.push} />}
  </RouterActions>
);
```

## Link

```js
import { Link } from 'spa-router';

export const LinkExample = ({ href = '/' }) => {
  const handleClick = () => console.log('click');

  return (
    <Link href={href} onClick={handleClick}>
      Link Component
    </Link>
  );
};
```

## Redirect

```js
import { Redirect, useResource } from 'spa-router';
import { userResource } from 'spa/routes/resources';
import { Profile } from 'spa/user';

export const RedirectExample = () => {
  const [{ data, loading, error }] = useResource(userResource);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error && error.code === 403) {
    return <Redirect to="/login" />;
  }

  return <Profile data={data} />;
};
```
