import React from 'react';

import { DefaultCreate } from './shared/Create';
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
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { AtlassianNavigation } from '../src';

import { ProfilePopup } from './shared/ProfilePopup';
import { SwitcherPopup } from './shared/SwitcherPopup';
import { HelpPopup } from './shared/HelpPopup';
import { NotificationsPopup } from './shared/NotificationsPopup';

const CustomProductHomeExample = () => (
  <div>
    <AtlassianNavigation
      primaryItems={bitbucketPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={BitbucketProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AtlassianNavigation
      primaryItems={confluencePrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={ConfluenceProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AtlassianNavigation
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={JiraProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AtlassianNavigation
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={JiraServiceDeskProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AtlassianNavigation
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={JiraSoftwareProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AtlassianNavigation
      primaryItems={opsGeniePrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={OpsGenieProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AtlassianNavigation
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={DefaultCustomProductHome}
      renderProfile={ProfilePopup}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
  </div>
);

export default CustomProductHomeExample;
