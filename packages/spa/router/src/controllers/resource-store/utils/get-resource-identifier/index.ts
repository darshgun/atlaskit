import {
  RouteResource,
  RouterStoreContext,
  ResourceStoreContext,
} from '../../../../common/types';

export const getResourceIdentifier = (
  resource: RouteResource,
  routerStoreContext: RouterStoreContext,
  resourceStoreContext: ResourceStoreContext,
): string => {
  const { type, getKey } = resource;
  const key = getKey(routerStoreContext, resourceStoreContext);

  return `${type}/${key}`;
};
