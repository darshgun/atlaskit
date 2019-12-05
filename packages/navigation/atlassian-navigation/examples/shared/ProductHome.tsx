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

import { CustomProductHome, ProductHome, atlassianTheme } from '../../src';

import atlassianIconUrl from './assets/atlassian-icon.png';
import atlassianLogoUrl from './assets/atlassian-logo.png';

const Icon = ({ icon: Icon }: { icon: React.ComponentType<any> }) => {
  const {
    mode: { productHome },
  } = atlassianTheme;
  return (
    <Icon
      iconGradientStart={productHome.gradientStart}
      iconGradientStop={productHome.gradientStop}
      iconColor={productHome.iconColor}
      textColor={productHome.color}
    />
  );
};

const Logo = ({ logo: Logo }: { logo: React.ComponentType<any> }) => {
  const {
    mode: { productHome },
  } = atlassianTheme;
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
    icon={() => <Icon icon={BitbucketIcon} />}
    logo={() => <Logo logo={BitbucketLogo} />}
  />
);

export const ConfluenceProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={() => <Icon icon={ConfluenceIcon} />}
    logo={() => <Logo logo={ConfluenceLogo} />}
    href="#"
  />
);

export const JiraProductHome = () => (
  <ProductHome
    onClick={console.log}
    siteTitle="Extranet"
    icon={() => <Icon icon={JiraIcon} />}
    logo={() => <Logo logo={JiraLogo} />}
  />
);

export const JiraServiceDeskProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={() => <Icon icon={JiraServiceDeskIcon} />}
    logo={() => <Logo logo={JiraServiceDeskLogo} />}
    href="#"
  />
);

export const JiraSoftwareProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={() => <Icon icon={JiraSoftwareIcon} />}
    logo={() => <Logo logo={JiraSoftwareLogo} />}
    href="#"
  />
);

export const OpsGenieProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    onClick={console.log}
    icon={() => <Icon icon={OpsGenieIcon} />}
    logo={() => <Logo logo={OpsGenieLogo} />}
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
