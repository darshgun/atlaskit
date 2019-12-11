import {
  BitbucketIcon,
  BitbucketLogo,
  ConfluenceIcon,
  ConfluenceLogo,
  JiraIcon,
  JiraLogo,
  JiraServiceDeskIcon,
  JiraServiceDeskLogo,
  JiraSoftwareIcon,
  JiraSoftwareLogo,
  OpsGenieIcon,
  OpsGenieLogo,
} from '@atlaskit/logo';
import React from 'react';

import {
  CustomProductHome,
  ProductHome,
  atlassianTheme,
  NavigationTheme,
} from '../../src';

import atlassianIconUrl from './assets/atlassian-icon.png';
import atlassianLogoUrl from './assets/atlassian-logo.png';

const ThemedIcon = ({
  icon: Icon,
  theme = atlassianTheme,
}: {
  icon: React.ComponentType<any>;
  theme?: NavigationTheme;
}) => {
  const {
    mode: { productHome },
  } = theme;
  return (
    <Icon
      iconGradientStart={productHome.gradientStart}
      iconGradientStop={productHome.gradientStop}
      iconColor={productHome.iconColor}
      textColor={productHome.color}
    />
  );
};

const ThemedLogo = ({
  logo: Logo,
  theme = atlassianTheme,
}: {
  logo: React.ComponentType<any>;
  theme?: NavigationTheme;
}) => {
  const {
    mode: { productHome },
  } = theme;
  return (
    <Logo
      iconGradientStart={productHome.gradientStart}
      iconGradientStop={productHome.gradientStop}
      iconColor={productHome.iconColor}
      textColor={productHome.color}
    />
  );
};
export const BitbucketProductHome = () => (
  <ProductHome
    onClick={console.log}
    siteTitle="Extranet"
    icon={() => <ThemedIcon icon={BitbucketIcon} />}
    logo={() => <ThemedLogo logo={BitbucketLogo} />}
  />
);

export const ConfluenceProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={() => <ThemedIcon icon={ConfluenceIcon} />}
    logo={() => <ThemedLogo logo={ConfluenceLogo} />}
    href="#"
  />
);

export const JiraProductHome = ({ theme }: { theme?: NavigationTheme }) => (
  <ProductHome
    onClick={console.log}
    siteTitle="Extranet"
    icon={() => <ThemedIcon icon={JiraIcon} theme={theme} />}
    logo={() => <ThemedLogo logo={JiraLogo} theme={theme} />}
  />
);

export const JiraServiceDeskProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={() => <ThemedIcon icon={JiraServiceDeskIcon} />}
    logo={() => <ThemedLogo logo={JiraServiceDeskLogo} />}
    href="#"
  />
);

export const JiraSoftwareProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={() => <ThemedIcon icon={JiraSoftwareIcon} />}
    logo={() => <ThemedLogo logo={JiraSoftwareLogo} />}
    href="#"
  />
);

export const OpsGenieProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    onClick={console.log}
    icon={() => <ThemedIcon icon={OpsGenieIcon} />}
    logo={() => <ThemedLogo logo={OpsGenieLogo} />}
  />
);

export const DefaultProductHome = JiraProductHome;

export const DefaultCustomProductHome = () => (
  <CustomProductHome
    href="#"
    siteTitle="Extranet"
    iconAlt="Custom icon"
    iconUrl={atlassianIconUrl}
    logoAlt="Custom logo"
    logoUrl={atlassianLogoUrl}
  />
);
