import {
  getAdministrationLinks,
  getAvailableProductLinks,
  getCustomLinkItems,
  getFixedProductLinks,
  getProvisionedProducts,
  getRecentLinkItems,
  getSuggestedProductLink,
  getDiscoverSectionLinks,
  SwitcherItemType,
} from './links';
import {
  hasLoaded,
  isComplete,
  isError,
  ProviderResult,
  Status,
} from '../providers/as-data-provider';
import {
  AvailableProductsResponse,
  CustomLinksResponse,
  FeatureMap,
  Product,
  RecentContainersResponse,
  RecommendationsEngineResponse,
  UserSiteDataResponse,
} from '../types';
import { createCollector } from './create-collector';

function collectAvailableProductLinks(
  cloudId: string | null | undefined,
  availableProducts?: ProviderResult<AvailableProductsResponse>,
): SwitcherItemType[] | undefined {
  if (availableProducts) {
    if (isError(availableProducts)) {
      return [];
    }
    if (isComplete(availableProducts)) {
      return getAvailableProductLinks(availableProducts.data, cloudId);
    }
    return;
  }
  return;
}

function collectSuggestedLinks(
  userSiteData: ProviderResult<UserSiteDataResponse>,
  productRecommendations: ProviderResults['productRecommendations'],
  isXFlowEnabled: ProviderResults['isXFlowEnabled'],
  isDiscoverSectionEnabled?: boolean,
) {
  if (isError(isXFlowEnabled) || isError(userSiteData)) {
    return [];
  }
  if (
    isComplete(userSiteData) &&
    isComplete(isXFlowEnabled) &&
    isComplete(productRecommendations)
  ) {
    return isXFlowEnabled.data
      ? getSuggestedProductLink(
          userSiteData.data.provisionedProducts,
          productRecommendations.data,
          isDiscoverSectionEnabled,
        )
      : [];
  }
}

function collectCanManageLinks(
  managePermission: ProviderResults['managePermission'],
) {
  if (isComplete(managePermission)) {
    return managePermission.data;
  }
}

function collectAdminLinks(
  managePermission: ProviderResults['managePermission'],
  addProductsPermission: ProviderResults['addProductsPermission'],
  isDiscoverMoreForEveryoneEnabled: boolean,
  isEmceeLinkEnabled: boolean,
  product?: Product,
  isDiscoverSectionEnabled?: boolean,
) {
  if (isError(managePermission) || isError(addProductsPermission)) {
    return [];
  }

  if (isComplete(managePermission) && isComplete(addProductsPermission)) {
    if (managePermission.data || addProductsPermission.data) {
      return getAdministrationLinks(
        managePermission.data,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
        product,
        isDiscoverSectionEnabled,
      );
    }

    return [];
  }
}

function collectFixedProductLinks(
  isDiscoverMoreForEveryoneEnabled: boolean,
): SwitcherItemType[] {
  return getFixedProductLinks({
    isDiscoverMoreForEveryoneEnabled,
  });
}

function collectRecentLinks(
  recentContainers: ProviderResults['recentContainers'],
  userSiteData: ProviderResult<UserSiteDataResponse>,
) {
  if (isError(recentContainers) || isError(userSiteData)) {
    return [];
  }

  if (isComplete(recentContainers) && isComplete(userSiteData)) {
    return getRecentLinkItems(
      recentContainers.data.data,
      userSiteData.data.currentSite,
    );
  }
}

function collectCustomLinks(
  customLinks: ProviderResults['customLinks'],
  userSiteData: ProviderResult<UserSiteDataResponse>,
) {
  if (customLinks === undefined || isError(userSiteData)) {
    return [];
  }

  if (isComplete(customLinks) && isComplete(userSiteData)) {
    return getCustomLinkItems(customLinks.data, userSiteData.data.currentSite);
  }
}

interface ProviderResults {
  customLinks?: ProviderResult<CustomLinksResponse>;
  recentContainers: ProviderResult<RecentContainersResponse>;
  managePermission: ProviderResult<boolean>;
  addProductsPermission: ProviderResult<boolean>;
  isXFlowEnabled: ProviderResult<boolean>;
  productRecommendations: ProviderResult<RecommendationsEngineResponse>;
}

function asUserSiteDataProviderResult(
  availableProductsProvider: ProviderResult<AvailableProductsResponse>,
  cloudId: string | null | undefined,
  product?: Product,
): ProviderResult<UserSiteDataResponse> {
  switch (availableProductsProvider.status) {
    case Status.LOADING: // intentional fallthrough
    case Status.ERROR:
      return availableProductsProvider;
    case Status.COMPLETE:
      const site =
        cloudId &&
        availableProductsProvider.data.sites.find(
          site => site.cloudId === cloudId,
        );

      if (product === Product.BITBUCKET) {
        return {
          status: Status.COMPLETE,
          data: {
            currentSite: {
              url: 'https://bitbucket.org',
              products: [],
            },
            provisionedProducts: getProvisionedProducts(
              availableProductsProvider.data,
            ),
          },
        };
      }

      if (!site) {
        return {
          status: Status.ERROR,
          data: null,
          error: new Error(
            `could not find site in availableProducts for cloudId ${cloudId}`,
          ),
        };
      }
      return {
        status: Status.COMPLETE,
        data: {
          currentSite: {
            url: site.url,
            products: site.availableProducts,
          },
          provisionedProducts: getProvisionedProducts(
            availableProductsProvider.data,
          ),
        },
      };
  }
}

export function mapResultsToSwitcherProps(
  cloudId: string | null | undefined,
  results: ProviderResults,
  features: FeatureMap,
  availableProducts: ProviderResult<AvailableProductsResponse>,
  product?: Product,
) {
  const collect = createCollector();

  const {
    isXFlowEnabled,
    managePermission,
    addProductsPermission,
    customLinks,
    recentContainers,
    productRecommendations,
  } = results;
  const userSiteData = asUserSiteDataProviderResult(
    availableProducts,
    cloudId,
    product,
  );
  const hasLoadedAvailableProducts = hasLoaded(availableProducts);
  const hasLoadedAdminLinks =
    hasLoaded(managePermission) && hasLoaded(addProductsPermission);
  const hasLoadedSuggestedProducts = features.xflow
    ? hasLoaded(productRecommendations) && hasLoaded(isXFlowEnabled)
    : true;
  const hasLoadedDiscoverSection =
    features.isDiscoverSectionEnabled &&
    hasLoadedAvailableProducts &&
    hasLoadedSuggestedProducts &&
    hasLoadedAdminLinks;

  return {
    licensedProductLinks: collect(
      collectAvailableProductLinks(cloudId, availableProducts),
      [],
    ),
    suggestedProductLinks: features.xflow
      ? collect(
          collectSuggestedLinks(
            userSiteData,
            productRecommendations,
            isXFlowEnabled,
            features.isDiscoverSectionEnabled,
          ),
          [],
        )
      : [],
    fixedLinks: !features.isDiscoverSectionEnabled
      ? collect(
          collectFixedProductLinks(features.isDiscoverMoreForEveryoneEnabled),
          [],
        )
      : [],
    adminLinks: collect(
      collectAdminLinks(
        managePermission,
        addProductsPermission,
        features.isDiscoverMoreForEveryoneEnabled,
        features.isEmceeLinkEnabled,
        product,
        features.isDiscoverSectionEnabled,
      ),
      [],
    ),
    recentLinks: collect(
      collectRecentLinks(recentContainers, userSiteData),
      [],
    ),
    customLinks: collect(collectCustomLinks(customLinks, userSiteData), []),

    showManageLink: collect(collectCanManageLinks(managePermission), false),
    hasLoaded:
      hasLoadedAvailableProducts &&
      hasLoadedAdminLinks &&
      hasLoadedSuggestedProducts,
    hasLoadedCritical: hasLoadedAvailableProducts,
    discoverSectionLinks: hasLoadedDiscoverSection
      ? getDiscoverSectionLinks({
          product,
          isDiscoverMoreForEveryoneEnabled:
            features.isDiscoverMoreForEveryoneEnabled,
          isEmceeLinkEnabled: features.isEmceeLinkEnabled,
        })
      : [],
  };
}
