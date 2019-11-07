import React from 'react';

import { DefaultCreate } from './shared/Create';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { AtlassianNavigation } from '../src';
import { ProfilePopup } from './shared/ProfilePopup';
import { SwitcherPopup } from './shared/SwitcherPopup';
import { HelpPopup } from './shared/HelpPopup';
import { NotificationsPopup } from './shared/NotificationsPopup';

const AuthenticatedExample = () => (
  <AtlassianNavigation
    primaryItems={defaultPrimaryItems}
    renderAppSwitcher={SwitcherPopup}
    renderCreate={DefaultCreate}
    renderHelp={HelpPopup}
    renderNotifications={NotificationsPopup}
    renderProductHome={DefaultProductHome}
    renderProfile={ProfilePopup}
    renderSearch={DefaultSearch}
    renderSettings={DefaultSettings}
  />
);

export default AuthenticatedExample;
