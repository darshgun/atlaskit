import { Routes, ResourceStoreContext } from '../../common/types';

export type RequestResourcesParams = {
  location: string;
  routes: Routes;
  resourceContext?: ResourceStoreContext;
};
