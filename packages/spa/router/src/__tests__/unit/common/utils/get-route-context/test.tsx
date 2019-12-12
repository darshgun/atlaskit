import React from 'react';
import { getRouteContext } from '../../../../../common/utils/get-route-context';

const mockComponent = () => <div>I am a route</div>;

const mockRoutes = [
  { path: '/foo', component: mockComponent, navigation: null },
  { path: '/boo', component: mockComponent, navigation: null },
  { path: '/baz', component: mockComponent, navigation: null },
];

const mockLocation = {
  pathname: '/baz',
  search: '?iam=cool',
  hash: '',
};

const mockAction = 'PUSH';

describe('SPA Router getRouteContext util', () => {
  it('should return the route match', () => {
    // @ts-ignore not passing a full route
    const context = getRouteContext(mockLocation, mockRoutes, mockAction);

    expect(context).toEqual(
      expect.objectContaining({
        location: mockLocation,
        route: mockRoutes[2],
        match: expect.objectContaining({
          isExact: true,
          path: mockRoutes[2].path,
          url: mockRoutes[2].path,
        }),
        action: mockAction,
      }),
    );
  });

  it('should return an empty context when the location does not match a route', () => {
    const unknownLocation = {
      ...mockLocation,
      pathname: '/unknown',
    };
    // @ts-ignore not passing a full route
    const context = getRouteContext(unknownLocation, mockRoutes, mockAction);

    expect(context).toEqual({
      location: unknownLocation,
      route: null,
      match: null,
      action: mockAction,
      query: {
        iam: 'cool',
      },
    });
  });
});
