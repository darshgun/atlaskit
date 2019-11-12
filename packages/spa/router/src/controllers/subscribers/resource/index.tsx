import React, { ReactNode } from 'react';

import {
  RouteResource,
  RouteResourceResponse,
  RouteResourceData,
} from '../../../common/types';
import { ResourceSubscriber as ResourceSweetStateSubscriber } from '../../resource-store';
import { getSliceForResource } from '../../resource-store/selectors';
import { RouterSubscriber } from '../route';

type Props = {
  children: (
    resource: RouteResourceResponse & {
      update: (data: RouteResourceData | null) => void;
      refresh: () => void;
    },
  ) => ReactNode;
  resource: RouteResource;
};

export const ResourceSubscriber = ({ children, resource }: Props) => (
  <ResourceSweetStateSubscriber>
    {(state, actions) => (
      <RouterSubscriber>
        {({ route, match, query, location }) => {
          const { type, getKey, maxAge } = resource;
          const key = getKey({ route, match, query, location }, state.context);
          const slice = getSliceForResource(state, {
            type,
            key,
          });

          return children({
            ...slice,
            update: (newData: RouteResourceData | null) => {
              actions.updateResourceState(type, key, maxAge, newData);
            },
            refresh: () => {
              actions.getResourceFromRemote(resource, {
                route,
                match,
                query,
                location,
              });
            },
          });
        }}
      </RouterSubscriber>
    )}
  </ResourceSweetStateSubscriber>
);
