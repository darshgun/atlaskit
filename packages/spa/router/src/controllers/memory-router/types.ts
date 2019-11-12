import { ReactNode } from 'react';
import {
  Routes,
  ResourceStoreData,
  ResourceStoreContext,
} from '../../common/types';
import { TransitionBlocker } from '../router-store/types';

export type MemoryRouterProps = {
  isStatic?: boolean;
  location?: string;
  transitionBlocker?: TransitionBlocker;
  routes: Routes;
  children: ReactNode;
  resourceData?: ResourceStoreData;
  resourceContext?: ResourceStoreContext;
};
