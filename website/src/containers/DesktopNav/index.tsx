import React from 'react';
import { Skeleton, presetThemes } from '@atlaskit/navigation';
import { RouteComponentProps } from 'react-router-dom';

const SkeletonNav = ({ location }: RouteComponentProps) => {
  const isContainerNavOpen = location ? location.pathname === '/' : true;
  return (
    <Skeleton
      isCollapsed={isContainerNavOpen}
      containerTheme={presetThemes.global}
    />
  );
};

const DesktopNav = React.lazy(() => import('./DesktopNav'));

export default (props: RouteComponentProps) => (
  <React.Suspense fallback={<SkeletonNav {...props} />}>
    <DesktopNav {...props} />
  </React.Suspense>
);
