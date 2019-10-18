/** @jsx jsx */
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { jsx } from '@emotion/core';

import { NavigationTheme, ThemeProvider, defaultTheme } from '../../theme';
import { containerCSS, leftCSS, rightCSS } from './styles';
import { PrimaryItemsContainer } from '../PrimaryItemsContainer';
import { AtlassianNavigationProps } from './types';

const analyticsData = {
  attributes: { navigationLayer: 'global' },
  componentName: 'atlassianNavigation',
};

export const AtlassianNavigation = (
  props: AtlassianNavigationProps & { theme: NavigationTheme },
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
            {AppSwitcher && <AppSwitcher />}
            {ProductHome && <ProductHome />}
            <PrimaryItemsContainer moreLabel={moreLabel} items={primaryItems} />
          </div>
          <div css={rightCSS}>
            {Create && <Create />}
            {Search && <Search />}
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

AtlassianNavigation.defaultProps = {
  primaryItems: [],
  moreLabel: '…',
  theme: defaultTheme,
};
