import React, { ReactNodeArray, ReactNode } from 'react';

import { AppNavigationTheme } from '../../theme';

export type AppNavigationProps = {
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
  theme?: AppNavigationTheme;
};

export type AppNavigationSkeletonProps = {
  primaryItemsCount?: number;
  secondaryItemsCount?: number;
  theme?: AppNavigationTheme;
};
