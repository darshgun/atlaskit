import { RouteResource, RouteResourceGettersArgs } from '../../common/types';
import { DEFAULT_RESOURCE_MAX_AGE } from '../resource-store/constants';

/**
 * Utility method to created async versions of getData functions
 *
 */
type GetDataLoader = () => Promise</* inexact */ {
  default: RouteResource['getData'];
}>;

const handleGetDataLoader = (asyncImport: GetDataLoader) => {
  return async (...args: RouteResourceGettersArgs) => {
    const { default: getDataFn } = await asyncImport();
    return getDataFn(...args);
  };
};

export const createResource = (args: any): RouteResource => ({
  type: args.type,
  getKey: args.getKey,
  getData: args.getDataLoader
    ? handleGetDataLoader(args.getDataLoader)
    : args.getData,
  maxAge:
    typeof args.maxAge === 'number' ? args.maxAge : DEFAULT_RESOURCE_MAX_AGE,
});
