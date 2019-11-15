import {
  routeHasChanged,
  routeHasResources,
} from '../../../../../../controllers/resource-store/utils/route-checks';

describe('routeHasChanged()', () => {
  it('should return true if the route objects do not match', () => {
    expect(
      routeHasChanged(
        // $FlowFixMe - not all properties on mock
        {
          path: '/some-path',
          component: () => null,
        },
        // $FlowFixMe - not all properties on mock
        {
          path: '/another-path',
          component: () => null,
        },
      ),
    ).toBeTruthy();
  });

  it('should return true if the prev route is null', () => {
    expect(
      routeHasChanged(
        null,
        // $FlowFixMe - not all properties on mock
        {
          path: '/another-path',
          component: () => null,
        },
      ),
    ).toBeTruthy();
  });

  it('should return false if the routes match', () => {
    const route = {
      path: '/some-path',
      component: () => null,
    };

    // $FlowFixMe - not all properties on mock
    expect(routeHasChanged(route, route)).toBeFalsy();
  });
});

describe('routeHasResources()', () => {
  it('should return true if the route has one or more resources', () => {
    const route = {
      path: '/some-path',
      component: () => null,
      resources: [{ mock: 'resource' }],
    };
    // $FlowFixMe - not all properties on mock
    expect(routeHasResources(route)).toBeTruthy();
  });

  it('should return false if the route does not exist', () => {
    const route = null;
    expect(routeHasResources(route)).toBeFalsy();
  });

  it('should return false if the route has no resources', () => {
    const route = {
      path: '/some-path',
      component: () => null,
      resources: [],
    };
    // $FlowFixMe - not all properties on mock
    expect(routeHasResources(route)).toBeFalsy();
  });

  it('should return false if the route does not have a resources property', () => {
    const route = {
      path: '/some-path',
      component: () => null,
    };
    // $FlowFixMe - not all properties on mock
    expect(routeHasResources(route)).toBeFalsy();
  });
});
