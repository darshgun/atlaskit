import React from 'react';

import { fetchJson, postJson } from '../utils/fetch';
import asDataProvider, {
  ProviderResult,
  ResultComplete,
  Status,
} from './as-data-provider';
import {
  Permissions,
  RecentContainersResponse,
  UserPermissionResponse,
  WithCloudId,
  XFlowSettingsResponse,
} from '../types';
import { withCached } from '../utils/with-cached';
import withHandleOptionalCloudId from './with-handle-optional-cloud-id';

// Recent activity api
const fetchRecentContainers = ({ cloudId }: WithCloudId) =>
  fetchJson<RecentContainersResponse>(
    `/gateway/api/activity/api/client/recent/containers?cloudId=${cloudId}`,
  );

const RealRecentContainersProvider = asDataProvider(
  'recentContainers',
  fetchRecentContainers,
);

export const emptyRecentContainers: ResultComplete<RecentContainersResponse> = {
  status: Status.COMPLETE,
  data: { data: [] },
};

export const RecentContainersProvider = withHandleOptionalCloudId(
  ({
    cloudId,
    disableRecentContainers,
    children,
  }: {
    disableRecentContainers?: boolean;
    children: (
      recentContainers: ProviderResult<RecentContainersResponse>,
    ) => React.ReactNode;
  } & WithCloudId) => {
    if (disableRecentContainers) {
      return <React.Fragment>{children(emptyRecentContainers)}</React.Fragment>;
    }

    return (
      <RealRecentContainersProvider cloudId={cloudId}>
        {children}
      </RealRecentContainersProvider>
    );
  },
  emptyRecentContainers.data,
);

// Permissions api
type FetchPermissionParamsType = WithCloudId & {
  permissionId: Permissions;
};
const fetchPermission = withCached(
  ({ cloudId, permissionId }: FetchPermissionParamsType) =>
    postJson<UserPermissionResponse>(`/gateway/api/permissions/permitted`, {
      permissionId,
      resourceId: `ari:cloud:platform::site/${cloudId}`,
    }).then(permission => permission.permitted),
);

export const UserPermissionProvider = withHandleOptionalCloudId(
  asDataProvider('permission', fetchPermission, fetchPermission.cached),
  false,
);

// Xflow settings api
const fetchXflowSettings = withCached(({ cloudId }: WithCloudId) =>
  fetchJson<XFlowSettingsResponse>(
    `/gateway/api/site/${cloudId}/setting/xflow`,
  ).then(xFlowSettings =>
    xFlowSettings['product-suggestions-enabled'] !== undefined
      ? xFlowSettings['product-suggestions-enabled']
      : true,
  ),
);

export const XFlowSettingsProvider = withHandleOptionalCloudId(
  asDataProvider(
    'xflowSettings',
    fetchXflowSettings,
    fetchXflowSettings.cached,
  ),
  true,
);

export const prefetchAll = ({ cloudId }: WithCloudId) => {
  fetchXflowSettings({ cloudId });
  fetchPermission({
    cloudId,
    permissionId: Permissions.ADD_PRODUCTS,
  });
  fetchPermission({ cloudId, permissionId: Permissions.MANAGE });
};

export const resetAll = () => {
  fetchXflowSettings.reset();
  fetchPermission.reset();
};
