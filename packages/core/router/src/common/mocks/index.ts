// import type {
//   RouteContext,
//   Location,
//   Match,
//   Query,
//   HistoryAction,
//   Route,
//   Routes,
//   MatchedRoute,
//   RouteResourceResponse,
//   RouterStoreContext,
//   ResourceStoreContext,
// } from '../types';

export const mockLocation = {
  pathname: 'pathname',
  search: 'search',
  hash: 'hash',
};

export const mockMatch = {
  params: {},
  isExact: false,
  path: '',
  url: '',
  query: {},
};

export const mockQuery = {};

export const mockAction = 'PUSH';

export const mockRoute = {
  path: '/pathname',
  component: () => null,
  navigation: null,
};

export const mockRoutes = [
  mockRoute,
  { ...mockRoute, path: '/a' },
  { ...mockRoute, path: '/b' },
];

export const mockMatchedRoute = {
  route: mockRoute,
  match: mockMatch,
};

export const mockRouteContext = {
  route: mockRoute,
  location: mockLocation,
  query: mockQuery,
  action: mockAction,
  match: mockMatch,
};

export const mockRouteResourceResponse = {
  loading: false,
  error: null,
  data: { foo: 'bar' },
  promise: null,
  expiresAt: Date.now(),
};

export const mockRouterStoreContext = {
  route: null,
  location: { pathname: '', search: '', hash: '' },
  query: mockQuery,
  match: mockMatch,
};

export const mockRouteContextProp = (key: string, mock: Object) => ({
  ...mockRouteContext,
  // @ts-ignore
  [key]: { ...mockRouteContext[key], ...mock },
});

export const mockRouterStoreContextProp = (key: string, mock: Object) => ({
  ...mockRouterStoreContext,
  // @ts-ignore
  [key]: { ...mockRouterStoreContext[key], ...mock },
});
