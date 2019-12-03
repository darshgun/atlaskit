/* eslint-disable prefer-destructuring */
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { defaultRegistry } from 'react-sweet-state';

import { ResourceStore } from '../../../../../controllers/resource-store';
import { createResource } from '../../../../../controllers/resource-utils';
import { getRouterState } from '../../../../../controllers/router-store';

import { useResource } from '../../../../../controllers/hooks/resource-store';
import {
  DEFAULT_ROUTE,
  DEFAULT_MATCH,
  DEFAULT_HISTORY,
} from '../../../../../common/constants';

jest.mock('../../../../../controllers/router-store', () => ({
  ...jest.requireActual('../../../../../controllers/router-store'),
  getRouterState: jest.fn(),
}));

const mockType = 'some-type';
const mockKey = 'i-am-a-key';
const mockSlice = {
  data: null,
  error: null,
  loading: false,
  promise: Promise.resolve(),
  expiresAt: 0,
};
const mockData = 'some-data';
const getDataPromise = Promise.resolve(mockData);
const mockMatch = {
  params: {},
  query: {},
  isExact: false,
  path: '',
  url: '',
};
const mockResource = createResource({
  type: mockType,
  getKey: () => mockKey,
  getData: () => getDataPromise,
  maxAge: 100,
});
const mockHydratableState = {
  resourceContext: {
    route: null,
    match: mockMatch,
    query: {},
  },
  resourceData: {
    [mockType]: {
      [mockKey]: mockSlice,
    },
  },
};

const MockComponent = ({ children }: { children: any }) => {
  return children();
};

const mockRouterStoreContext = {
  route: DEFAULT_ROUTE,
  match: DEFAULT_MATCH,
  query: {},
  location: DEFAULT_HISTORY.location,
};

describe('useResource hook', () => {
  let resourceStore;
  let storeState: any;
  let actions: any;
  const spy = jest.fn();

  beforeEach(() => {
    // @ts-ignore
    resourceStore = defaultRegistry.getStore(ResourceStore);
    storeState = resourceStore.storeState;
    actions = resourceStore.actions;

    (getRouterState as any).mockReturnValue(mockRouterStoreContext);

    actions.hydrate(mockHydratableState);
    jest.spyOn(global.Date, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    defaultRegistry.stores.clear();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should return the slice and bound actions for a given resource', () => {
    mount(
      <MockComponent>
        {() => {
          const resource = useResource(mockResource);

          spy(resource);
          return <h1>my test</h1>;
        }}
      </MockComponent>,
    );

    expect(spy).toHaveBeenCalledWith([
      {
        ...mockSlice,
        update: expect.any(Function),
        refresh: expect.any(Function),
      },
    ]);
  });

  describe('update action', () => {
    it('should update a resource with the provided data', () => {
      const newData = 'my-better-data';
      let resourceResponse: any;
      mount(
        <MockComponent>
          {() => {
            const [resource] = useResource(mockResource);
            resourceResponse = resource;

            return <h1>my test</h1>;
          }}
        </MockComponent>,
      );

      act(() => resourceResponse.update(newData));

      const storeData = storeState.getState();

      expect(storeData.data[mockType][mockKey]).toEqual({
        ...mockSlice,
        expiresAt: 100,
        data: newData,
      });
    });

    it('should update a resource with the data set to null', () => {
      const newData = null;
      let resourceResponse: any;
      mount(
        <MockComponent>
          {() => {
            const [resource] = useResource(mockResource);
            resourceResponse = resource;

            return <h1>my test</h1>;
          }}
        </MockComponent>,
      );

      act(() => resourceResponse.update(newData));

      const storeData = storeState.getState();

      expect(storeData.data[mockType][mockKey]).toEqual({
        ...mockSlice,
        expiresAt: 100,
        data: newData,
      });
    });
  });

  describe('refresh action', () => {
    it('should call actions.getResourceFromRemote', () => {
      const getResourceSpy = jest
        .spyOn(actions, 'getResourceFromRemote')
        .mockImplementation(() => {});
      let resourceResponse: any;
      mount(
        <MockComponent>
          {() => {
            const [resource] = useResource(mockResource);
            resourceResponse = resource;

            return <h1>my test</h1>;
          }}
        </MockComponent>,
      );

      act(() => resourceResponse.refresh());

      expect(getResourceSpy).toHaveBeenCalledWith(
        mockResource,
        mockRouterStoreContext,
      );
    });
  });
});
