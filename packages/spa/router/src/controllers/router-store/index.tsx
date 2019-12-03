import {
  createStore,
  defaultRegistry,
  createContainer,
  createSubscriber,
  createHook,
} from 'react-sweet-state';
import { createPath } from 'history';

import {
  DEFAULT_HISTORY,
  DEFAULT_MATCH,
  DEFAULT_ROUTE,
  DEFAULT_ACTION,
} from '../../common/constants';
import { getRouteContext } from '../../common/utils/get-route-context';
import { getResourceStore } from '../resource-store';
import { getResourcesForNextLocation } from '../resource-store/utils';

import { EntireRouterState, AllRouterActions, ContainerProps } from './types';
import { isExternalAbsolutePath, getRelativePath } from './utils';

export const INITIAL_STATE: EntireRouterState = {
  history: DEFAULT_HISTORY,
  location: DEFAULT_HISTORY.location,
  query: {},
  routes: [],
  route: DEFAULT_ROUTE,
  match: DEFAULT_MATCH,
  action: DEFAULT_ACTION,
  unlisten: null,
  isStatic: false,
  transitionBlocker: async () => true,
  shouldUseSuspense: false,
};

const actions: AllRouterActions = {
  /**
   * Bootstraps the store with initial data.
   *
   */
  bootstrapStore: props => ({ setState, dispatch }) => {
    const { resourceContext, resourceData, ...initialProps } = props;
    const { history, routes, isStatic } = initialProps;
    const routeContext = getRouteContext(history.location, routes);

    setState({ ...initialProps, ...routeContext });
    getResourceStore().actions.hydrate({ resourceContext, resourceData });

    if (!isStatic) {
      dispatch(actions.listen());
    }
  },

  /**
   * Uses the resource store to request resources for the route.
   * Must be dispatched after setting state with the new route context.
   *
   */
  requestRouteResources: () => ({ getState }) => {
    const { route, match, query, location } = getState();

    return getResourceStore().actions.requestAllResources({
      route,
      match,
      query,
      location,
    });
  },

  /**
   * Starts listening to browser history and sets the unlisten function in state.
   * Will request route resources on route change.
   *
   */
  listen: () => ({ getState, setState }) => {
    const { history, routes, unlisten } = getState();

    if (unlisten) {
      return;
    }

    const stopListening = history.listen(async (location, action) => {
      const nextContext = getRouteContext(location, routes);
      const {
        match: currentMatch,
        route: currentRoute,
        query: currentQuery,
        location: currentLocation,
        transitionBlocker,
      } = getState();
      const canDo = await transitionBlocker(
        currentMatch && currentRoute
          ? {
              match: currentMatch,
              route: currentRoute,
            }
          : null,
        nextContext.match && nextContext.route
          ? {
              match: nextContext.match,
              route: nextContext.route,
            }
          : null,
        action,
      );

      if (canDo) {
        const {
          actions: { cleanExpiredResources, requestResources },
          storeState,
        } = getResourceStore();
        const nextLocationContext = {
          route: nextContext.route,
          match: nextContext.match,
          query: nextContext.query,
          location,
        };
        const nextResources = getResourcesForNextLocation(
          {
            route: currentRoute,
            match: currentMatch,
            query: currentQuery,
            location: currentLocation,
          },
          nextLocationContext,
          storeState.getState().context,
        );

        cleanExpiredResources(nextResources, nextLocationContext);
        setState({ ...nextContext, action });
        requestResources(nextResources, nextLocationContext);
      } else {
        // because history stack already updated, in order not to mess up it up, we can only replace the route
        // using assign will push a new entry to the history stack.
        window.location.replace(createPath(location));
      }
    });

    setState({
      unlisten: stopListening,
    });
  },

  push: path => ({ getState }) => {
    const { history } = getState();

    if (isExternalAbsolutePath(path)) {
      window.location.assign(path);
    } else {
      history.push(getRelativePath(path));
    }
  },

  replace: path => ({ getState }) => {
    const { history } = getState();

    if (isExternalAbsolutePath(path)) {
      window.location.replace(path);
    } else {
      history.replace(getRelativePath(path));
    }
  },

  goBack: () => ({ getState }) => {
    const { history } = getState();

    history.goBack();
  },

  goForward: () => ({ getState }) => {
    const { history } = getState();

    history.goForward();
  },

  registerBlock: blocker => ({ getState }) => {
    const { history } = getState();

    return history.block(blocker);
  },
};

type State = EntireRouterState;

type Actions = AllRouterActions;

export const RouterStore = createStore<State, Actions>({
  initialState: INITIAL_STATE,
  actions,
  name: 'router',
});

export const RouterContainer = createContainer<State, Actions, ContainerProps>(
  RouterStore,
  {
    displayName: 'RouterContainer',
    onInit: () => ({ dispatch }, props) => {
      dispatch(actions.bootstrapStore(props));
      !props.isStatic && dispatch(actions.requestRouteResources());
    },
  },
);

export const RouterSubscriber = createSubscriber<State, Actions>(RouterStore, {
  displayName: 'RouterSubscriber',
});

export const RouterActionsSubscriber = createSubscriber<
  State,
  Actions,
  void,
  {}
>(RouterStore, {
  displayName: 'RouterActionsSubscriber',
  selector: null,
});

export const RouteResourceEnabledSubscriber = createSubscriber<
  State,
  Actions,
  boolean
>(RouterStore, {
  selector: state => Boolean(state.route && state.route.resources),
});

export const useRouterStore = createHook<EntireRouterState, AllRouterActions>(
  RouterStore,
);

export const useRouterStoreStatic = createHook<
  EntireRouterState,
  AllRouterActions,
  void
>(RouterStore, {
  selector: null,
});

export const getRouterStore = () =>
  // @ts-ignore calling `getStore` without providing a scopeId
  defaultRegistry.getStore<EntireRouterState, AllRouterActions>(RouterStore);

// @ts-ignore accessing private store property
export const getRouterState = () => getRouterStore().storeState.getState();
