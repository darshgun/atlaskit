import React from 'react';
import MobileHeader from '@atlaskit/mobile-header';
import { MobileNavProps } from './../../types';

const MobileNav = React.lazy(() => import('./MobileNav'));

export default (props?: MobileNavProps) => (
  <React.Suspense fallback={<MobileHeader />}>
    <MobileNav {...props} />
  </React.Suspense>
);
