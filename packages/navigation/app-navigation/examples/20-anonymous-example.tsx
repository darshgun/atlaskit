import React from 'react';

import { DefaultAppSwitcher } from './shared/AppSwitcher';
import { DefaultCreate } from './shared/Create';
import { DefaultHelp } from './shared/Help';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultSearch } from './shared/Search';
import { AppNavigation, SignIn } from '../src';

const SignInExample = () => <SignIn tooltip="Sign in" />;

const AnonymousExample = () => (
  <AppNavigation
    primaryItems={defaultPrimaryItems}
    renderAppSwitcher={DefaultAppSwitcher}
    renderCreate={DefaultCreate}
    renderHelp={DefaultHelp}
    renderProductHome={DefaultProductHome}
    renderSignIn={SignInExample}
    renderSearch={DefaultSearch}
  />
);

export default AnonymousExample;
