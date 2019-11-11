export {
  Router,
  MemoryRouter,
  StaticRouter,
  RouterSubscriber,
  RouteResourceEnabledSubscriber,
  Redirect,
  RouterActions,
  withRouter,
  ResourceSubscriber,
  useResource,
  useRouter,
  useResourceStoreContext,
  createResource,
  useRouterActions,
} from './controllers';
export { RouteComponent, Link, noopRouterDecorator } from './ui';
export {
  matchRoute,
  generatePath,
  createLegacyHistory,
  getRouteContext,
} from './common/utils';

// export type {
//   Location,
//   Route,
//   Routes,
//   Match,
//   MatchedRoute,
//   RouteResource,
//   RouteContext,
//   RouterStoreContext,
//   ResourceStoreData,
//   HistoryBlocker,
//   Navigation,
//   NavigationType,
//   NavigationRenderUpdater,
//   NavigationStatics,
// } from './src/common/types';

// export type {
//   RouterActionsType,
//   RouterActionPush,
//   RouterActionReplace,
//   RouterSubscriberProps,
// } from './src/controllers/router-store/types';

export {
  mockRouteContextProp,
  mockRouterStoreContextProp,
} from './common/mocks';
