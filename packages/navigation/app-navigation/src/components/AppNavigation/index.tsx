/** @jsx jsx */
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { jsx } from '@emotion/core';

import { AppNavigationTheme, ThemeProvider, defaultTheme } from '../../theme';
import { containerCSS, leftCSS, rightCSS } from './styles';
import { PrimaryItemsContainer } from '../PrimaryItemsContainer';
import { AppNavigationProps } from './types';

const analyticsData = {
  attributes: { navigationLayer: 'global' },
  componentName: 'appNavigation',
};

export const AppNavigation = (
  props: AppNavigationProps & { theme: AppNavigationTheme },
) => {
  const {
    primaryItems,
    renderAppSwitcher: AppSwitcher,
    renderCreate: Create,
    renderHelp: Help,
    renderNotifications: Notifications,
    renderProductHome: ProductHome,
    renderProfile: Profile,
    renderSearch: Search,
    renderSignIn: SignIn,
    renderSettings: Settings,
    moreLabel,
    theme,
  } = props;

  return (
    <ThemeProvider value={theme}>
      <NavigationAnalyticsContext data={analyticsData}>
        <div css={containerCSS(theme)}>
          <div css={leftCSS}>
            {ProductHome && <ProductHome />}
            <PrimaryItemsContainer moreLabel={moreLabel} items={primaryItems} />
          </div>
          <div css={rightCSS}>
            {Create && <Create />}
            {Search && <Search />}
            {AppSwitcher && <AppSwitcher />}
            {Notifications && <Notifications />}
            {Settings && <Settings />}
            {Help && <Help />}
            {SignIn && <SignIn />}
            {Profile && <Profile />}
          </div>
        </div>
      </NavigationAnalyticsContext>
    </ThemeProvider>
  );
};

AppNavigation.defaultProps = {
  primaryItems: [],
  moreLabel: '…',
  theme: defaultTheme,
};
