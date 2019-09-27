import * as React from 'react';
import { FormattedMessage as FormattedMessageNamespace } from 'react-intl';

import DiscoverFilledGlyph from '@atlaskit/icon/glyph/discover-filled';
import AddIcon from '@atlaskit/icon/glyph/add';
import SettingsGlyph from '@atlaskit/icon/glyph/settings';
import MarketplaceGlyph from '@atlaskit/icon/glyph/marketplace';

import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraSoftwareIcon,
  JiraServiceDeskIcon,
  JiraCoreIcon,
  OpsGenieIcon,
  StatuspageIcon,
  TrelloIcon,
} from '@atlaskit/logo';
import FormattedMessage from '../primitives/formatted-message';
import {
  RecentContainerType,
  AvailableProductsResponse,
  AvailableProduct,
  WorklensProductType,
  ProductKey,
  RecommendationsEngineResponse,
  Product,
  CurrentSiteResponse,
} from '../types';
import messages from './messages';
import { CustomLink, RecentContainer, SwitcherChildItem } from '../types';
import WorldIcon from '@atlaskit/icon/glyph/world';
import { createIcon, createImageIcon, IconType } from './icon-themes';

interface MessagesDict {
  [index: string]: FormattedMessageNamespace.MessageDescriptor;
}

export type SwitcherItemType = {
  key: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  Icon: IconType;
  href: string;
  childItems?: SwitcherChildItem[];
  productType?: WorklensProductType;
};

export type RecentItemType = SwitcherItemType & {
  type: string;
  description: React.ReactNode;
};

export const OBJECT_TYPE_TO_LABEL_MAP: MessagesDict = {
  'jira-project': messages.jiraProject,
  'confluence-space': messages.confluenceSpace,
};

export const getObjectTypeLabel = (type: string): React.ReactNode => {
  return OBJECT_TYPE_TO_LABEL_MAP[type] ? (
    <FormattedMessage {...OBJECT_TYPE_TO_LABEL_MAP[type]} />
  ) : (
    type
  );
};

export const getFixedProductLinks = (params: {
  isDiscoverMoreForEveryoneEnabled: boolean;
}): SwitcherItemType[] => {
  return params.isDiscoverMoreForEveryoneEnabled
    ? [
        {
          // The discover more link href is intentionally empty to prioritise the onDiscoverMoreClicked callback
          key: 'discover-more',
          label: <FormattedMessage {...messages.discoverMore} />,
          Icon: createIcon(AddIcon, { size: 'medium' }),
          href: '',
        },
      ]
    : [];
};

type AvailableProductDetails = Pick<
  SwitcherItemType,
  'label' | 'Icon' | 'href'
>;

export const AVAILABLE_PRODUCT_DATA_MAP: {
  [productKey in WorklensProductType]: AvailableProductDetails
} = {
  [WorklensProductType.BITBUCKET]: {
    label: 'Bitbucket',
    Icon: createIcon(BitbucketIcon, { size: 'small' }),
    href: '/wiki',
  },
  [WorklensProductType.CONFLUENCE]: {
    label: 'Confluence',
    Icon: createIcon(ConfluenceIcon, { size: 'small' }),
    href: '/wiki',
  },
  [WorklensProductType.JIRA_BUSINESS]: {
    label: 'Jira Core',
    Icon: createIcon(JiraCoreIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=business',
  },
  [WorklensProductType.JIRA_SOFTWARE]: {
    label: 'Jira Software',
    Icon: createIcon(JiraSoftwareIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=software',
  },
  [WorklensProductType.JIRA_SERVICE_DESK]: {
    label: 'Jira Service Desk',
    Icon: createIcon(JiraServiceDeskIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
  },
  [WorklensProductType.OPSGENIE]: {
    label: 'Opsgenie',
    Icon: createIcon(OpsGenieIcon, { size: 'small' }),
    href: 'https://app.opsgenie.com',
  },
  [WorklensProductType.STATUSPAGE]: {
    label: 'Statuspage',
    Icon: createIcon(StatuspageIcon, { size: 'small' }),
    href: 'https://statuspage.io',
  },
  [WorklensProductType.TRELLO]: {
    label: 'Trello',
    Icon: createIcon(TrelloIcon, { size: 'small' }),
    href: 'https://trello.com',
  },
};

const PRODUCT_ORDER = [
  WorklensProductType.JIRA_SOFTWARE,
  WorklensProductType.JIRA_SERVICE_DESK,
  WorklensProductType.JIRA_BUSINESS,
  WorklensProductType.CONFLUENCE,
  WorklensProductType.OPSGENIE,
  WorklensProductType.BITBUCKET,
  WorklensProductType.STATUSPAGE,
  WorklensProductType.TRELLO,
];

const BROWSE_APPS_URL: { [Key in Product]?: string | undefined } = {
  [Product.JIRA]: '/plugins/servlet/ac/com.atlassian.jira.emcee/discover',
  [Product.CONFLUENCE]:
    '/wiki/plugins/servlet/ac/com.atlassian.confluence.emcee/discover',
};

const TO_WORKLENS_PRODUCT_KEY = {
  [ProductKey.CONFLUENCE]: WorklensProductType.CONFLUENCE,
  [ProductKey.JIRA_CORE]: WorklensProductType.JIRA_BUSINESS,
  [ProductKey.JIRA_SERVICE_DESK]: WorklensProductType.JIRA_SERVICE_DESK,
  [ProductKey.JIRA_SOFTWARE]: WorklensProductType.JIRA_SOFTWARE,
  [ProductKey.OPSGENIE]: WorklensProductType.OPSGENIE,
};

interface ConnectedSite {
  avatar: string | null;
  product: AvailableProduct;
  isCurrentSite: boolean;
  siteName: string;
  siteUrl: string;
}

const getProductSiteUrl = (connectedSite: ConnectedSite): string => {
  const { product, siteUrl } = connectedSite;

  if (
    product.productType === WorklensProductType.OPSGENIE ||
    product.productType === WorklensProductType.BITBUCKET ||
    product.productType === WorklensProductType.STATUSPAGE ||
    product.productType === WorklensProductType.TRELLO
  ) {
    return product.url;
  }

  return siteUrl + AVAILABLE_PRODUCT_DATA_MAP[product.productType].href;
};

const getAvailableProductLinkFromSiteProduct = (
  connectedSites: ConnectedSite[],
): SwitcherItemType => {
  const topSite =
    connectedSites.find(site => site.isCurrentSite) ||
    connectedSites.sort(
      (a, b) => b.product.activityCount - a.product.activityCount,
    )[0];
  const productType = topSite.product.productType;
  const productLinkProperties = AVAILABLE_PRODUCT_DATA_MAP[productType];

  return {
    ...productLinkProperties,
    key: productType + topSite.siteName,
    href: getProductSiteUrl(topSite),
    description: topSite.siteName,
    productType,
    childItems:
      connectedSites.length > 1
        ? connectedSites
            .map(site => ({
              href: getProductSiteUrl(site),
              label: site.siteName,
              avatar: site.avatar,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        : [],
  };
};

export const getAvailableProductLinks = (
  availableProducts: AvailableProductsResponse,
  cloudId: string | null | undefined,
): SwitcherItemType[] => {
  const productsMap: { [key: string]: ConnectedSite[] } = {};

  availableProducts.sites.forEach(site => {
    const { availableProducts, avatar, displayName, url } = site;
    availableProducts.forEach(product => {
      const { productType } = product;

      if (!productsMap[productType]) {
        productsMap[productType] = [];
      }

      productsMap[productType].push({
        product,
        isCurrentSite: Boolean(cloudId) && site.cloudId === cloudId,
        siteName: displayName,
        siteUrl: url,
        avatar,
      });
    });
  });

  return PRODUCT_ORDER.map(productType => {
    const connectedSites = productsMap[productType];
    return (
      connectedSites && getAvailableProductLinkFromSiteProduct(connectedSites)
    );
  }).filter(link => !!link);
};

export const getAdministrationLinks = (
  isAdmin: boolean,
  isDiscoverMoreForEveryoneEnabled: boolean,
  isEmceeLinkEnabled: boolean,
  product?: Product,
): SwitcherItemType[] => {
  const adminBaseUrl = isAdmin ? `/admin` : '/trusted-admin';
  const adminLinks = [
    {
      key: 'administration',
      label: <FormattedMessage {...messages.administration} />,
      Icon: createIcon(SettingsGlyph, { size: 'medium' }),
      href: adminBaseUrl,
    },
  ];
  const emceeLink = product && BROWSE_APPS_URL[product];
  if (isEmceeLinkEnabled && emceeLink) {
    adminLinks.unshift({
      key: 'browse-apps',
      label: <FormattedMessage {...messages.browseApps} />,
      Icon: createIcon(MarketplaceGlyph, { size: 'medium' }),
      href: `${emceeLink}#!/discover?source=app_switcher`,
    });
  }
  if (!isDiscoverMoreForEveryoneEnabled) {
    adminLinks.unshift({
      key: 'discover-applications',
      label: <FormattedMessage {...messages.discoverMore} />,
      Icon: createIcon(DiscoverFilledGlyph, { size: 'medium' }),
      href: `${adminBaseUrl}/billing/addapplication`,
    });
  }
  return adminLinks;
};

const PRODUCT_RECOMMENDATION_LIMIT = 2;

export const getSuggestedProductLink = (
  currentSite: CurrentSiteResponse,
  productRecommendations: RecommendationsEngineResponse,
): SwitcherItemType[] => {
  return productRecommendations
    .filter(legacyProduct => {
      const productKey = TO_WORKLENS_PRODUCT_KEY[legacyProduct.productKey];
      return !currentSite.products.find(
        product => product.productType === productKey,
      );
    })
    .map(legacyProduct => {
      const productKey = TO_WORKLENS_PRODUCT_KEY[legacyProduct.productKey];
      return {
        key: legacyProduct.productKey,
        ...AVAILABLE_PRODUCT_DATA_MAP[productKey],
      };
    })
    .slice(0, PRODUCT_RECOMMENDATION_LIMIT);
};

export const getCustomLinkItems = (
  list: Array<CustomLink>,
  currentSite: CurrentSiteResponse,
): SwitcherItemType[] => {
  const defaultProductCustomLinks = [
    `${currentSite.url}/secure/MyJiraHome.jspa`,
    `${currentSite.url}/wiki/`,
  ];
  return list
    .filter(
      customLink => defaultProductCustomLinks.indexOf(customLink.link) === -1,
    )
    .map(customLink => ({
      key: customLink.key,
      label: customLink.label,
      Icon: createIcon(WorldIcon),
      href: customLink.link,
    }));
};

export const getRecentLinkItems = (
  list: Array<RecentContainer>,
  currentSite: CurrentSiteResponse,
): RecentItemType[] => {
  const isAnyJiraProductActive = Boolean(
    currentSite.products.find(
      product =>
        product.productType === WorklensProductType.JIRA_BUSINESS ||
        product.productType === WorklensProductType.JIRA_SERVICE_DESK ||
        product.productType === WorklensProductType.JIRA_SOFTWARE,
    ),
  );
  const isConfluenceActive = Boolean(
    currentSite.products.find(
      product => product.productType === WorklensProductType.CONFLUENCE,
    ),
  );
  return list
    .filter((recent: RecentContainer) => {
      return (
        (recent.type === RecentContainerType.JIRA_PROJECT &&
          isAnyJiraProductActive) ||
        (recent.type === RecentContainerType.CONFLUENCE_SPACE &&
          isConfluenceActive) ||
        [
          RecentContainerType.JIRA_PROJECT,
          RecentContainerType.CONFLUENCE_SPACE,
        ].indexOf(recent.type) === -1
      );
    })
    .slice(0, 6)
    .map(customLink => ({
      key: customLink.objectId,
      label: customLink.name,
      Icon: createImageIcon(customLink.iconUrl),
      href: customLink.url,
      type: customLink.type,
      description: getObjectTypeLabel(customLink.type),
    }));
};
