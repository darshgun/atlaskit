import { ReactNode } from 'react';
import {
  BrowserHistory,
  Routes,
  ResourceStoreContext,
  ResourceStoreData,
} from '../../common/types';
import { TransitionBlocker } from '../router-store/types';

export type RouterProps = {
  isStatic: boolean;
  history: BrowserHistory;
  transitionBlocker: TransitionBlocker;
  resourceContext?: ResourceStoreContext;
  resourceData?: ResourceStoreData;
  routes: Routes;
  children: ReactNode;
};
