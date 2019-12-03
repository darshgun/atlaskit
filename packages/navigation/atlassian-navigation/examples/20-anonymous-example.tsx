import React from 'react';

import { DefaultCreate } from './shared/Create';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultSearch } from './shared/Search';
import { SwitcherPopup } from './shared/SwitcherPopup';
import { HelpPopup } from './shared/HelpPopup';
import { AtlassianNavigation, SignIn } from '../src';

const SignInExample = () => <SignIn tooltip="Sign in" />;

const AnonymousExample = () => (
  <AtlassianNavigation
    primaryItems={defaultPrimaryItems}
    renderAppSwitcher={SwitcherPopup}
    renderCreate={DefaultCreate}
    renderHelp={HelpPopup}
    renderProductHome={DefaultProductHome}
    renderSignIn={SignInExample}
    renderSearch={DefaultSearch}
  />
);

export default AnonymousExample;
