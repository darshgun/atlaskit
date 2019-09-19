import React from 'react';

import { DefaultAppSwitcher } from './shared/AppSwitcher';
import { DefaultCreate } from './shared/Create';
import { DefaultHelp } from './shared/Help';
import { DefaultNotifications } from './shared/Notifications';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultProfile } from './shared/Profile';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { AtlassianNavigation } from '../src';

const AuthenticatedExample = () => (
  <AtlassianNavigation
    primaryItems={defaultPrimaryItems}
    renderAppSwitcher={DefaultAppSwitcher}
    renderCreate={DefaultCreate}
    renderHelp={DefaultHelp}
    renderNotifications={DefaultNotifications}
    renderProductHome={DefaultProductHome}
    renderProfile={DefaultProfile}
    renderSearch={DefaultSearch}
    renderSettings={DefaultSettings}
  />
);

export default AuthenticatedExample;
