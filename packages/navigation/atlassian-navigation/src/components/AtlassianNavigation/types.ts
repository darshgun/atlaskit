import React, { ReactNodeArray, ReactNode } from 'react';

import { NavigationTheme } from '../../theme';

export type AtlassianNavigationProps = {
  primaryItems: ReactNodeArray;
  renderAppSwitcher?: React.ComponentType<{}>;
  renderCreate?: React.ComponentType<{}>;
  renderHelp?: React.ComponentType<{}>;
  renderNotifications?: React.ComponentType<{}>;
  renderProductHome: React.ComponentType<{}>;
  renderProfile?: React.ComponentType<{}>;
  renderSearch?: React.ComponentType<{}>;
  renderSignIn?: React.ComponentType<{}>;
  renderSettings?: React.ComponentType<{}>;
  moreLabel?: ReactNode;
  theme?: NavigationTheme;
};

export type NavigationSkeletonProps = {
  primaryItemsCount?: number;
  secondaryItemsCount?: number;
  showSiteName?: boolean;
  theme?: NavigationTheme;
};
