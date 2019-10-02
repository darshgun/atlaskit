import * as React from 'react';
import { ProviderResult } from './as-data-provider';

import { RecentContainersResponse } from '../types';

import {
  RecentContainersProvider,
  UserPermissionProvider,
  XFlowSettingsProvider,
} from './instance-data-providers';
import { RecommendationsEngineProvider } from './recommendations-provider';
import {
  Permissions,
  RecommendationsEngineResponse,
  RecommendationsFeatureFlags,
} from '../types';

interface CommonDataProviderProps {
  cloudId?: string;
  disableRecentContainers: boolean;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
  children: (
    props: {
      recentContainers: ProviderResult<RecentContainersResponse>;
      managePermission: ProviderResult<boolean>;
      addProductsPermission: ProviderResult<boolean>;
      isXFlowEnabled: ProviderResult<boolean>;
      productRecommendations: ProviderResult<RecommendationsEngineResponse>;
    },
  ) => React.ReactElement<any>;
}

export default ({
  cloudId,
  children,
  recommendationsFeatureFlags,
  disableRecentContainers,
}: CommonDataProviderProps) => {
  return (
    <RecentContainersProvider
      cloudId={cloudId}
      disableRecentContainers={disableRecentContainers}
    >
      {recentContainers => (
        <UserPermissionProvider
          cloudId={cloudId}
          permissionId={Permissions.MANAGE}
        >
          {managePermission => (
            <UserPermissionProvider
              cloudId={cloudId}
              permissionId={Permissions.ADD_PRODUCTS}
            >
              {addProductsPermission => (
                <XFlowSettingsProvider cloudId={cloudId}>
                  {isXFlowEnabled => (
                    <RecommendationsEngineProvider
                      featureFlags={recommendationsFeatureFlags}
                    >
                      {productRecommendations =>
                        children({
                          recentContainers,
                          managePermission,
                          addProductsPermission,
                          isXFlowEnabled,
                          productRecommendations,
                        })
                      }
                    </RecommendationsEngineProvider>
                  )}
                </XFlowSettingsProvider>
              )}
            </UserPermissionProvider>
          )}
        </UserPermissionProvider>
      )}
    </RecentContainersProvider>
  );
};
