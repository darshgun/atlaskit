import { ReactNode } from 'react';
import { ActionAny as Action } from 'react-sweet-state';

import {
  Href,
  Location,
  Route,
  Routes,
  Match,
  MatchedRoute,
  HistoryAction,
  BrowserHistory,
  Query,
  HistoryBlocker,
  ResourceStoreContext,
  ResourceStoreData,
} from '../../common/types';

export type TransitionBlocker = (
  currentMatchedRoute: MatchedRoute | null,
  nextMatchedRoute: MatchedRoute | null,
  action: HistoryAction,
) => Promise<boolean>;

type PublicStateProperties = {
  location: Location;
  query: Query;
  route: Route;
  match: Match;
  action: HistoryAction;
};

type Callback = () => void;

type PrivateStateProperties = {
  routes: Routes;
  history: BrowserHistory;
  unlisten: Callback | null;
  isStatic: boolean;
  transitionBlocker: TransitionBlocker;
  shouldUseSuspense: boolean;
};

export type EntireRouterState = PublicStateProperties & PrivateStateProperties;

export type ContainerProps = {
  isStatic?: boolean;
  history: BrowserHistory;
  location?: Location;
  routes: Routes;
  transitionBlocker?: TransitionBlocker;
  resourceData?: ResourceStoreData;
  resourceContext?: ResourceStoreContext;
};

export type RouterAction = Action<EntireRouterState, AllRouterActions>;

type PrivateRouterActions = {
  bootstrapStore: (initialState: ContainerProps) => RouterAction;
  requestRouteResources: () => RouterAction;
  listen: () => RouterAction;
};

type PublicRouterActions = {
  push: (path: Href, state?: any) => RouterAction;
  replace: (path: Href) => RouterAction;
  goBack: () => RouterAction;
  goForward: () => RouterAction;
  registerBlock: (blocker: HistoryBlocker | any) => RouterAction;
};

export type AllRouterActions = PrivateRouterActions & PublicRouterActions;

/**
 * Public API
 */
export type RouterState = PublicStateProperties;
export type RouterActionsType = PublicRouterActions;
export type RouterActionPush = RouterActionsType['push'];
export type RouterActionReplace = RouterActionsType['replace'];
export type RouterSubscriberProps = {
  children: (state: RouterState, actions: RouterActionsType) => ReactNode;
};
