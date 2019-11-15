/* eslint-disable no-use-before-define */

import { StoreActionApi } from 'react-sweet-state';
import {
  RouteResource,
  RouteResourceResponse,
  RouterStoreContext,
  ResourceStoreContext,
  ResourceStoreData,
  RouteResourceData,
} from '../../common/types';

export type State = {
  data: ResourceStoreData;
  context: ResourceStoreContext;
};

export type HydratableState = {
  resourceData?: ResourceStoreData;
  resourceContext?: ResourceStoreContext;
};

export type ContainerProps = {};

export type ResourceSliceIdentifier = {
  type: string;
  key: string;
};

type ResourceAction<R> = ({
  getState,
  setState,
  dispatch,
}: StoreActionApi<State>) => R;

export type Actions = {
  setResourceState: (
    type: RouteResource['type'],
    key: string,
    state: RouteResourceResponse,
  ) => ResourceAction<void>;
  updateResourceState: (
    type: RouteResource['type'],
    key: string,
    maxAge: RouteResource['maxAge'],
    newSliceData: RouteResourceData | null,
  ) => ResourceAction<void>;
  getResource: (
    resource: RouteResource,
    routerStoreContext: RouterStoreContext,
  ) => ResourceAction<Promise<RouteResourceResponse>>;
  getResourceFromRemote: (
    resource: RouteResource,
    routerStoreContext: RouterStoreContext,
  ) => ResourceAction<Promise<RouteResourceResponse>>;
  requestAllResources: (
    routerStoreContext: RouterStoreContext,
  ) => ResourceAction<Promise<RouteResourceResponse[]>>;
  cleanExpiredResources: (
    resources: RouteResource[],
    routerStoreContext: RouterStoreContext,
  ) => ResourceAction<void>;
  requestResources: (
    resources: RouteResource[],
    routerStoreContext: RouterStoreContext,
  ) => ResourceAction<Promise<RouteResourceResponse[]>>;
  requestResourcesForNextRoute: (
    prevRouterStoreContext: RouterStoreContext,
    nextRouterStoreContext: RouterStoreContext,
  ) => ResourceAction<Promise<RouteResourceResponse[]>>;
  hydrate: (
    state: HydratableState,
  ) => ({ getState, setState }: StoreActionApi<State>) => void;
  getContext: () => ({
    setState,
    getState,
  }: StoreActionApi<State>) => ResourceStoreContext;
  getSafeData: () => ({
    setState,
    getState,
  }: StoreActionApi<State>) => ResourceStoreData;
};
