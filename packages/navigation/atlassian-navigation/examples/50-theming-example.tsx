import React, { Fragment } from 'react';

import { DefaultCreate } from './shared/Create';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { themes } from './shared/themes';
import { AtlassianNavigation } from '../src';

import { ProfilePopup } from './shared/ProfilePopup';
import { SwitcherPopup } from './shared/SwitcherPopup';
import { HelpPopup } from './shared/HelpPopup';
import { NotificationsPopup } from './shared/NotificationsPopup';

const ThemingExample = () => (
  <div>
    {themes.map((theme, i) => (
      <Fragment key={i}>
        <AtlassianNavigation
          primaryItems={defaultPrimaryItems}
          renderAppSwitcher={SwitcherPopup}
          renderCreate={DefaultCreate}
          renderHelp={HelpPopup}
          renderNotifications={NotificationsPopup}
          renderProductHome={() => <DefaultProductHome theme={theme} />}
          renderProfile={ProfilePopup}
          renderSearch={DefaultSearch}
          renderSettings={DefaultSettings}
          theme={theme}
        />
        {i < themes.length - 1 && <br />}
      </Fragment>
    ))}
  </div>
);

export default ThemingExample;
