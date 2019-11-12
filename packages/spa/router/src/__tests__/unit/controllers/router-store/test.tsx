import React from 'react';
import { mount, render } from 'enzyme';
import { defaultRegistry } from 'react-sweet-state';
import * as historyHelper from 'history';

import { MemoryRouter } from '../../../../controllers/memory-router';
import { getResourceStore } from '../../../../controllers/resource-store';

import {
  RouterSubscriber,
  INITIAL_STATE,
  getRouterStore,
  getRouterState,
} from '../../../../controllers/router-store';
import { MatchedRoute, HistoryAction } from '../../../../common/types';
import { DEFAULT_ACTION } from '../../../../common/constants';

const mockLocation = {
  pathname: '/pathname',
  search: '?foo=bar',
  hash: '#hash',
};

const mockHistory = {
  push: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  registerBlock: jest.fn(),
  listen: jest.fn(),
  createHref: jest.fn(),
  location: mockLocation,
  block: jest.fn(),
};

const mockRoutes = [
  {
    path: '/pathname',
    component: () => <div>path</div>,
    navigation: null,
    name: '',
  },
  {
    path: '/blah',
    component: () => <div>path</div>,
    navigation: null,
    name: '',
  },
];

const waitALilBit = () => new Promise(resolve => setTimeout(resolve));

describe('SPA Router store', () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    // @ts-ignore
    window.location = {};
    Object.defineProperties(window.location, {
      href: { value: location.href },
      assign: { value: jest.fn() },
      replace: { value: jest.fn() },
    });
  });

  afterEach(() => {
    defaultRegistry.stores.clear();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    window.location = location;
  });

  describe('initialising the store', () => {
    beforeEach(() => {
      jest
        .spyOn(historyHelper, 'createMemoryHistory')
        // @ts-ignore
        .mockImplementation(() => mockHistory);
    });

    it('should call the history listener when initialised', () => {
      mount(
        <MemoryRouter routes={[]}>
          <RouterSubscriber>
            {() => <div>I am a subscriber</div>}
          </RouterSubscriber>
        </MemoryRouter>,
      );

      expect(mockHistory.listen).toBeCalled();
    });

    it('should send right props after render with routes', () => {
      mount(
        <MemoryRouter routes={[mockRoutes[0]]}>
          <RouterSubscriber>
            {({ history, location, routes, route, match, query }) => {
              expect(history).toEqual(mockHistory);
              expect(location).toEqual(mockLocation);
              expect(routes).toEqual(routes);
              expect(route).toEqual(
                expect.objectContaining({
                  path: `/pathname`,
                }),
              );
              expect(match).toBeTruthy();
              expect(query).toEqual({
                foo: 'bar',
              });

              return <div>I am a subscriber</div>;
            }}
          </RouterSubscriber>
        </MemoryRouter>,
      );
    });

    it('should use default store values if no overrides are provided', () => {
      expect.assertions(1);

      render(
        <RouterSubscriber>
          {renderProps => {
            expect(renderProps).toEqual(
              expect.objectContaining({
                ...INITIAL_STATE,
                history: expect.objectContaining({
                  push: expect.any(Function),
                  replace: expect.any(Function),
                  goBack: expect.any(Function),
                  goForward: expect.any(Function),
                  listen: expect.any(Function),
                  block: expect.any(Function),
                  createHref: expect.any(Function),
                }),
              }),
            );

            return <div>I am a lonely subscriber</div>;
          }}
        </RouterSubscriber>,
      );
    });
  });

  describe('listening for real history changes', () => {
    let children: any;

    beforeEach(() => {
      children = jest.fn().mockReturnValue(null);
    });

    it('should send location with route change', async () => {
      mount(
        <MemoryRouter routes={mockRoutes} location={mockRoutes[0].path}>
          <RouterSubscriber>{children}</RouterSubscriber>
        </MemoryRouter>,
      );
      const { history } = children.mock.calls[0][0];

      await waitALilBit();

      expect(children.mock.calls[0]).toEqual([
        expect.objectContaining({
          routes: mockRoutes,
          route: mockRoutes[0],
          action: DEFAULT_ACTION,
          history: expect.any(Object),
        }),
        expect.any(Object),
      ]);

      const newLocation = {
        pathname: '/blah',
        search: '?somequery=value',
        hash: '#bing',
      };

      history.push(Object.values(newLocation).join(''));

      await waitALilBit();

      expect(children.mock.calls[1]).toEqual([
        expect.objectContaining({
          routes: mockRoutes,
          route: mockRoutes[1],
          action: 'PUSH',
          history: expect.any(Object),
        }),
        expect.any(Object),
      ]);
    });

    it('should send correct action key for route changes', async () => {
      mount(
        <MemoryRouter routes={mockRoutes}>
          <RouterSubscriber>{children}</RouterSubscriber>
        </MemoryRouter>,
      );
      const { history } = children.mock.calls[0][0];

      expect(children.mock.calls[0]).toEqual([
        expect.objectContaining({
          action: DEFAULT_ACTION,
        }),
        expect.any(Object),
      ]);

      history.push('/pathname');

      await waitALilBit();

      expect(children.mock.calls[1]).toEqual([
        expect.objectContaining({
          action: 'PUSH',
        }),
        expect.any(Object),
      ]);

      history.replace('/blah');

      await waitALilBit();

      expect(children.mock.calls[2]).toEqual([
        expect.objectContaining({
          action: 'REPLACE',
        }),
        expect.any(Object),
      ]);
    });
  });

  describe('store actions', () => {
    const currentLocation = 'http://localhost/';

    beforeEach(() => {
      jest
        .spyOn(historyHelper, 'createMemoryHistory')
        // @ts-ignore
        .mockImplementation(() => mockHistory);
    });

    describe('push', () => {
      let children: any;

      beforeEach(() => {
        children = jest.fn().mockReturnValue(null);
      });

      it('should push a relative path if the URL is absolute but on the same domain', () => {
        mount(
          <MemoryRouter routes={[]}>
            <RouterSubscriber>{children}</RouterSubscriber>
          </MemoryRouter>,
        );
        const path = 'http://localhost:3000/board/123';
        const { actions } = getRouterStore();

        actions.push(path);

        // expect(window.location.href).toEqual(currentLocation);
        expect(mockHistory.push).toBeCalledWith('/board/123');
      });

      it('should call window.location.assign with the absolute URL if it is on a different domain', () => {
        jest
          .spyOn(window.location, 'assign')
          .mockImplementation(() => jest.fn());

        mount(
          <MemoryRouter routes={[]}>
            <RouterSubscriber>{children}</RouterSubscriber>
          </MemoryRouter>,
        );

        const path = 'http://example.com';
        const { actions } = getRouterStore();

        actions.push(path);

        expect(window.location.href).toEqual(currentLocation);
        expect(window.location.assign).toBeCalledWith(path);
      });
    });

    describe('replace', () => {
      let children: any;

      beforeEach(() => {
        children = jest.fn().mockReturnValue(null);
      });

      it('should replace a relative path if the URL is absolute but on the same domain', () => {
        mount(
          <MemoryRouter routes={[]}>
            <RouterSubscriber>{children}</RouterSubscriber>
          </MemoryRouter>,
        );
        const path = 'http://localhost:3000/board/123';
        const { actions } = getRouterStore();

        actions.replace(path);

        expect(window.location.href).toEqual(currentLocation);
        expect(mockHistory.replace).toBeCalledWith('/board/123');
      });

      it('should call window.location.replace with the absolute URL if it is on a different domain', () => {
        jest
          .spyOn(window.location, 'replace')
          .mockImplementation(() => jest.fn());

        mount(
          <MemoryRouter routes={[]}>
            <RouterSubscriber>{children}</RouterSubscriber>
          </MemoryRouter>,
        );

        const path = 'http://example.com';
        const { actions } = getRouterStore();

        actions.replace(path);

        expect(window.location.href).toEqual(currentLocation);
        expect(window.location.replace).toBeCalledWith(path);
      });
    });
  });

  describe('transition blocker', () => {
    let children: any;

    beforeEach(() => {
      children = jest.fn().mockReturnValue(null);
    });

    test('should call the transition blocker with current route and next route', done => {
      mount(
        <MemoryRouter
          routes={mockRoutes}
          location={mockRoutes[0].path}
          transitionBlocker={async (
            currentMatchedRoute: MatchedRoute | null,
            nextMatchedRoute: MatchedRoute | null,
            action: HistoryAction,
          ) => {
            if (!currentMatchedRoute || !nextMatchedRoute) {
              throw new Error('No matched routes?!');
            }

            expect(currentMatchedRoute.route.path).toBe(mockRoutes[0].path);
            expect(nextMatchedRoute.route.path).toBe(mockRoutes[1].path);
            expect(action).toBe('PUSH');

            done();
            return true;
          }}
        >
          <RouterSubscriber>{children}</RouterSubscriber>
        </MemoryRouter>,
      );

      const { history } = children.mock.calls[0][0];
      history.push(mockRoutes[1].path);
    });

    test('should call the window location replace method if transition blocked while push', async () => {
      jest
        .spyOn(window.location, 'replace')
        .mockImplementation(() => jest.fn());

      mount(
        <MemoryRouter
          routes={mockRoutes}
          location={mockRoutes[0].path}
          transitionBlocker={async () => false}
        >
          <RouterSubscriber>{children}</RouterSubscriber>
        </MemoryRouter>,
      );

      const { history } = children.mock.calls[0][0];
      history.push(mockRoutes[1].path);

      await waitALilBit();
      expect(window.location.replace).toBeCalledWith(mockRoutes[1].path);
    });

    test('should call the window location replace methods if transition blocked while replace', async () => {
      jest
        .spyOn(window.location, 'replace')
        .mockImplementation(() => jest.fn());

      mount(
        <MemoryRouter
          routes={mockRoutes}
          location={mockRoutes[0].path}
          transitionBlocker={async () => false}
        >
          <RouterSubscriber>{children}</RouterSubscriber>
        </MemoryRouter>,
      );

      const { history } = children.mock.calls[0][0];
      history.replace(mockRoutes[1].path);

      await waitALilBit();
      expect(window.location.replace).toBeCalledWith(mockRoutes[1].path);
    });
  });

  describe('resource store interop', () => {
    const containerProps = {
      isStatic: false,
      history: mockHistory,
      routes: [],
      resourceContext: {},
      resourceData: {},
      transitionBlocker: async () => true,
    };

    let children: any;

    beforeEach(() => {
      jest.clearAllMocks();
      children = jest.fn().mockReturnValue(null);
    });

    it('should hydrate the resource store state when bootstrapped', () => {
      const resourceContext = { foo: 'bar' };
      const resourceData = {};
      const initialResourceStoreState = {
        resourceContext,
        resourceData,
      };
      const props = { ...containerProps, ...initialResourceStoreState };
      const spy = jest.spyOn(getResourceStore().actions, 'hydrate');

      // @ts-ignore
      getRouterStore().actions.bootstrapStore(props);

      expect(spy).toBeCalledWith({
        resourceContext,
        resourceData,
      });
    });

    it('should request route resources when the router is mounted', () => {
      const spy = jest.spyOn(getResourceStore().actions, 'requestAllResources');

      mount(
        <MemoryRouter routes={mockRoutes}>
          <RouterSubscriber>{children}</RouterSubscriber>
        </MemoryRouter>,
      );

      const { route, match, query, location } = getRouterState();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ route, match, query, location });
    });

    it('should request route resources on history change', async () => {
      const spy = jest.spyOn(
        getResourceStore().actions,
        'requestResourcesForNextRoute',
      );

      mount(
        <MemoryRouter routes={mockRoutes}>
          <RouterSubscriber>{children}</RouterSubscriber>
        </MemoryRouter>,
      );
      const { history } = children.mock.calls[0][0];

      history.push('/pathname');

      await waitALilBit();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
