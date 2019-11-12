# Resources

```js
type RouteResource = {|
  /**
   * The unique namespace within the cache where the
   *  keyed resource data is stored
   */
  type: string,
  /**
   *  The unique key within the type namespace where the resource state
   *  is stored in the shape of
   *  { loading: boolean, data: ?object, error: ?object }
   */
  getKey: (
    routerStoreContext: RouterStoreContext,
    resourceStoreContext: ResourceStoreContext,
  ) => string,
  /**
   * how long the resource should be stored before being re-requested.
   *
   * Note: Resources are only re-requested on route change
   *
   * default is 0
   */
  maxAge?: number,
  /**
   * The function containing all the business logic / external API calls
   * to return a promise that resolves with resource data
   */
  getData: (
    routerStoreContext: RouterStoreContext,
    resourceStoreContext: ResourceStoreContext,
  ) => RouteResourcePromise,
|};
```

## Creating a resource

Resources should be created using the `createResource` function.

```js
import { createResource } from '@atlaskit/router';
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

### Handling errors in `getData`

It is worth noting that how you handle errors in `getData` can have a subtle effects.

```js
import { createResourceError } from '@atlaskit/router';

// Example of a getData function that is used to retrieve admin info
const getData = async (routerContext, resourceContext) => {
  const { query } = routerContext;

  // Tenant context is always provided in the Jira SPA
  const {
    tenantContext: { baseUrl, isAdmin },
  } = resourceContext;

  if (!isAdmin) {
    // NOT RECOMMENDED:
    // The resource slice will take the shape: `{data: {}, error: null, loading: false}`
    // You should consider throwing an error here to ensure `data` remains `null`
    return Promise.resolve({});
  }

  const data = getProjectsDirectoryData(baseUrl, isAdmin, query);

  if (!data) {
    // BETTER IMPLEMENTATION:
    // The resource slice will take the shape:  `{data: {errorCode: 'some error'}', error: null, loading: false}`
    // Only consider this pattern if your component is checking `data` for an errorCode property
    return { errorCode: 'some error' };
  }

  if (!data) {
    // RECOMMENDED IMPLEMENTATION:
    // The resource slice will take the shape:  `{data: null, error: ResourceError, loading: false}`
    // Additionally, the error will be logged using `log.safeError`
    throw createResourceError({
      component: 'spa.view.routes.my-component.getData',
      message: 'No data',
      name: 'ResourceError',
    });
  }

  return data;
};
```

You can also pass an optional second argument to `createResourceError`

```js
import { createResourceError } from '@atlaskit/router';

// Example of a getData function that is used to retrieve admin info
const getData = async (routerContext, resourceContext) => {
  const { query } = routerContext;

  // Tenant context is always provided in the Jira SPA
  const {
    tenantContext: { baseUrl, isAdmin },
  } = resourceContext;

  if (!isAdmin) {
    // RECOMMENDED IMPLEMENTATION:
    // The resource slice will take the shape:  `{data: null, error: AuthenticationError, loading: false}`
    // Additionally, the error will be logged using `log.safeError`
    throw createResourceError({
      component: 'spa.view.routes.my-component.getData',
      message: 'Not an admin',
      name: 'AuthenticationError',
    });
  }

  try {
    return getProjectsDirectoryData(baseUrl, isAdmin, query);
  } catch (originalError) {
    // RECOMMENDED IMPLEMENTATION:
    // The resource slice will take the shape:  `{data: null, error: Error, loading: false}`
    // Additionally, the error will be logged using `log.safeError`
    throw createResourceError(
      {
        component: 'spa.view.routes.my-component.getData', // These are logged using log.safeError
        message: 'No data', // These are logged using log.safeError
        name: 'ResourceError',
      },
      originalError, // this is the Error that ends up in the resource state
    );
  }
};
```

## Adding a resource to a route

```js
import { navigationResources } from 'spa/common';
import {
  ProjectsDirectory,
  projectsDirectoryNavigation,
  projectsDirectoryResource,
} from 'spa-apps/projects-directory';

export const routes = baseUrl => [
  {
    // unique route name
    name: 'projects-directory',
    // route group used by transition blocking (will be deprecated)
    group: 'projects-directory',
    // URL path to match against
    path: `${baseUrl}/projects`,
    // optional query parameters to match against (for legacy routes)
    query: [],
    // component to be rendered
    component: ProjectsDirectory,
    // navigation behaviour
    navigation: projectsDirectoryNavigation,
    // list of critical (and non) resources that the router
    // will start fetching
    resources: [...navigationResources, projectsDirectoryResource],
  },
];
```

## Using a resource in your page

You can retrieve a resource from the resource store using either hooks or the `ResourceSubscriber`
component.

To retrieve a resource, you need to pass in the same resource that you pass in to the router
configuration.

### Using hooks

```js
import { useResource } from '@atlaskit/router';
import { projectsDirectoryResource } from 'spa/routes/resources';
import { ProjectsDirectoryView } from 'spa-apps/projects-directory';
import { useTenantContext } from 'spa/common/hooks';

export const UseResourceExample = () => {
  // projectsDirectoryResource must be specified in the route configuration for the route we are rendering
  const [{ data, loading, error, update, refresh }] = useResource(
    projectsDirectoryResource,
  );
  const [{ tenantContext }] = useTenantContext();

  const props = { data, loading, error, update, ...tenantContext };

  return <ProjectsDirectoryView {...props} />;
};
```

### Using the ResourceSubscriber

```js
import { ResourceSubscriber } from '@atlaskit/router';
import { projectsDirectoryResource } from 'spa/routes/resources';
import { ProjectsDirectoryView } from 'spa-apps/projects-directory';
import { useTenantContext } from 'spa/common/hooks';

export const ResourceSubscriberExample = () => {
  const [{ tenantContext }] = useTenantContext();

  // projectsDirectoryResource must be specified in the route configuration for the route we are rendering
  return (
    <ResourceSubscriber resource={projectsDirectoryResource}>
      {resource => <ProjectsDirectoryView {...resource} {...tenantContext} />}
    </ResourceSubscriber>
  );
};
```

## Updating resources

Both the `useResource` hook and the `ResourceSubscriber` provide both an `update` and a `refresh`
property on the resource.

### Update

The update function is bound to the resource that you provide to `useResource` or the
`ResourceSubscriber`. Calling this function will replace the `data` property of the resource in the
store and set the `expiresAt` value, according the to the `maxAge` of the resource.

Example using hooks

```js
import { useCallback } from 'react';
import { useResource } from '@atlaskit/router';
import { projectsDirectoryResource } from 'spa/routes/resources';
import { ProjectsDirectoryView } from 'spa-apps/projects-directory';
import { useTenantContext } from 'spa/common/hooks';

export const UpdateResourceExample = () => {
  // projectsDirectoryResource must be specified in the route configuration for the route we are rendering
  const [{ data, loading, error, update, refresh }] = useResource(
    projectsDirectoryResource,
  );
  const [{ tenantContext }] = useTenantContext();

  return (
    <>
      <button
        onClick={() => {
          update(null);
        }}
      >
        Clear the resource
      </button>
      <button
        onClick={() => {
          update({
            foo: 'bar',
          });
        }}
      >
        Put some fake data in resource
      </button>
    </>
  );
};
```

Examples using `ResourceSubscriber`

```js
import { ResourceSubscriber } from '@atlaskit/router';
import { projectsDirectoryResource } from 'spa/routes/resources';
import { ProjectsDirectoryView } from 'spa-apps/projects-directory';
import { useTenantContext } from 'spa/common/hooks';

export const ResourceSubscriberExample = () => {
  const [{ tenantContext }] = useTenantContext();

  // projectsDirectoryResource must be specified in the route configuration for the route we are rendering
  return (
    <ResourceSubscriber resource={projectsDirectoryResource}>
      {resource => (
        <>
          <button
            onClick={() => {
              resource.update(null);
            }}
          >
            Clear the resource
          </button>
          <button
            onClick={() => {
              resource.update({
                foo: 'bar',
              });
            }}
          >
            Put some fake data in resource
          </button>
        </>
      )}
    </ResourceSubscriber>
  );
};
```

## Refreshing resources

The refresh function is bound to the resource that you provide to `useResource` or the
`ResourceSubscriber`. Calling this function will cause the router to call the `getData` function on
your resource, and bypass any `expiresAt` checks. The resource will always be fetched from the
remote and the store will be updated with any result, including errors.

Example using hooks

```js
import { useCallback } from 'react';
import { useResource } from '@atlaskit/router';
import { projectsDirectoryResource } from 'spa/routes/resources';
import { ProjectsDirectoryView } from 'spa-apps/projects-directory';
import { useTenantContext } from 'spa/common/hooks';

export const RefreshResourceExample = () => {
  // projectsDirectoryResource must be specified in the route configuration for the route we are rendering
  const [{ data, loading, error, update, refresh }] = useResource(
    projectsDirectoryResource,
  );
  const [{ tenantContext }] = useTenantContext();

  const onClick = useCallback(() => {
    refresh();
  }, [update]);

  return <button onClick={onClick}>Fetch some fresh data</button>;
};
```

Example using the ResourceSubscriber

```js
import { ResourceSubscriber } from '@atlaskit/router';
import { projectsDirectoryResource } from 'spa/routes/resources';
import { ProjectsDirectoryView } from 'spa-apps/projects-directory';
import { useTenantContext } from 'spa/common/hooks';

export const ResourceSubscriberExample = () => {
  const [{ tenantContext }] = useTenantContext();

  // projectsDirectoryResource must be specified in the route configuration for the route we are rendering
  return (
    <ResourceSubscriber resource={projectsDirectoryResource}>
      {resource => (
        <button
          onClick={() => {
            resource.refresh();
          }}
        >
          Fetch some fresh data
        </button>
      )}
    </ResourceSubscriber>
  );
};
```
