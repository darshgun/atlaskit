import React from 'react';

import { DefaultAppSwitcher } from './shared/AppSwitcher';
import { DefaultCreate } from './shared/Create';
import { DefaultHelp } from './shared/Help';
import { DefaultNotifications } from './shared/Notifications';
import {
  bitbucketPrimaryItems,
  confluencePrimaryItems,
  jiraPrimaryItems,
  opsGeniePrimaryItems,
} from './shared/PrimaryItems';
import {
  BitbucketProductHome,
  ConfluenceProductHome,
  DefaultCustomProductHome,
  JiraProductHome,
  JiraServiceDeskProductHome,
  JiraSoftwareProductHome,
  OpsGenieProductHome,
} from './shared/ProductHome';
import { DefaultProfile } from './shared/Profile';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { NavigationContainer } from '../src';

const CustomProductHomeExample = () => (
  <div>
    <NavigationContainer
      primaryItems={bitbucketPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={DefaultNotifications}
      renderProductHome={BitbucketProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <NavigationContainer
      primaryItems={confluencePrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={DefaultNotifications}
      renderProductHome={ConfluenceProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <NavigationContainer
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={DefaultNotifications}
      renderProductHome={JiraProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <NavigationContainer
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={DefaultNotifications}
      renderProductHome={JiraServiceDeskProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <NavigationContainer
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={DefaultNotifications}
      renderProductHome={JiraSoftwareProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <NavigationContainer
      primaryItems={opsGeniePrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={DefaultNotifications}
      renderProductHome={OpsGenieProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <NavigationContainer
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={DefaultNotifications}
      renderProductHome={DefaultCustomProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
  </div>
);

export default CustomProductHomeExample;
