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

import { CustomProductHome, ProductHome } from '../../src';

import atlassianIconUrl from './assets/atlassian-icon.png';
import atlassianLogoUrl from './assets/atlassian-logo.png';

export const BitbucketProductHome = () => (
  <ProductHome siteTitle="Extranet" icon={BitbucketIcon} logo={BitbucketLogo} />
);

export const ConfluenceProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={ConfluenceIcon}
    logo={ConfluenceLogo}
  />
);

export const JiraProductHome = () => (
  <ProductHome siteTitle="Extranet" icon={JiraIcon} logo={JiraLogo} />
);

export const JiraServiceDeskProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={JiraServiceDeskIcon}
    logo={JiraServiceDeskLogo}
  />
);

export const JiraSoftwareProductHome = () => (
  <ProductHome
    siteTitle="Extranet"
    icon={JiraSoftwareIcon}
    logo={JiraSoftwareLogo}
  />
);

export const OpsGenieProductHome = () => (
  <ProductHome siteTitle="Extranet" icon={OpsGenieIcon} logo={OpsGenieLogo} />
);

export const DefaultProductHome = JiraProductHome;

export const DefaultCustomProductHome = () => (
  <CustomProductHome
    siteTitle="Extranet"
    iconAlt="Custom icon"
    iconUrl={atlassianIconUrl}
    logoAlt="Custom logo"
    logoUrl={atlassianLogoUrl}
  />
);
