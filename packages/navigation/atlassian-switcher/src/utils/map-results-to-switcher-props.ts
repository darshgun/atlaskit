import {
  getAdministrationLinks,
  getAvailableProductLinks,
  getCustomLinkItems,
  getFixedProductLinks,
  getRecentLinkItems,
  getSuggestedProductLink,
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
  LicenseInformationResponse,
  Product,
  ProductKey,
  ProductLicenseInformation,
  RecentContainersResponse,
  RecommendationsEngineResponse,
  WorklensProductType,
  CurrentSiteResponse,
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
  currentSite: ProviderResult<CurrentSiteResponse>,
  productRecommendations: ProviderResults['productRecommendations'],
  isXFlowEnabled: ProviderResults['isXFlowEnabled'],
) {
  if (isError(isXFlowEnabled) || isError(currentSite)) {
    return [];
  }
  if (
    isComplete(currentSite) &&
    isComplete(isXFlowEnabled) &&
    isComplete(productRecommendations)
  ) {
    return isXFlowEnabled.data
      ? getSuggestedProductLink(currentSite.data, productRecommendations.data)
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
      );
    }

    return [];
  }
}

function collectFixedProductLinks(
  product: Product | undefined,
  isDiscoverMoreForEveryoneEnabled: boolean,
): SwitcherItemType[] {
  // People link is only available in Jira / Confluence
  const canShowPeopleLink =
    product === Product.CONFLUENCE || product === Product.JIRA;
  return getFixedProductLinks({
    canShowPeopleLink,
    isDiscoverMoreForEveryoneEnabled,
  });
}

function collectRecentLinks(
  recentContainers: ProviderResults['recentContainers'],
  licenseInformation: ProviderResult<LicenseInformationResponse>,
) {
  if (isError(recentContainers) || isError(licenseInformation)) {
    return [];
  }

  if (isComplete(recentContainers) && isComplete(licenseInformation)) {
    return getRecentLinkItems(
      recentContainers.data.data,
      licenseInformation.data,
    );
  }
}

function collectCustomLinks(
  customLinks: ProviderResults['customLinks'],
  currentSite: ProviderResult<CurrentSiteResponse>,
) {
  if (customLinks === undefined || isError(currentSite)) {
    return [];
  }

  if (isComplete(customLinks) && isComplete(currentSite)) {
    return getCustomLinkItems(customLinks.data, currentSite.data);
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

function asLegacyProductKey(
  worklensProductType: WorklensProductType,
): ProductKey | undefined {
  switch (worklensProductType) {
    case WorklensProductType.BITBUCKET:
      return undefined; // not used in legacy code
    case WorklensProductType.CONFLUENCE:
      return ProductKey.CONFLUENCE;
    case WorklensProductType.JIRA_BUSINESS:
      return ProductKey.JIRA_CORE;
    case WorklensProductType.JIRA_SERVICE_DESK:
      return ProductKey.JIRA_SERVICE_DESK;
    case WorklensProductType.JIRA_SOFTWARE:
      return ProductKey.JIRA_SOFTWARE;
    case WorklensProductType.OPSGENIE:
      return ProductKey.OPSGENIE;
    default:
      throw new Error(`unmapped worklensProductType ${worklensProductType}`);
  }
}

/** Convert the new AvailableProductsResponse to legacy LicenseInformationResponse type */
function asLicenseInformationProviderResult(
  availableProductsProvider: ProviderResult<AvailableProductsResponse>,
  cloudId: string | null | undefined,
): ProviderResult<LicenseInformationResponse> {
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
          hostname: site.url,
          products: site.availableProducts.reduce(
            (acc: { [key: string]: ProductLicenseInformation }, product) => {
              const legacyProductKey = asLegacyProductKey(product.productType);
              if (legacyProductKey) {
                acc[legacyProductKey] = {
                  state: 'ACTIVE', // everything is ACTIVE
                  // applicationUrl: '', // not required
                  // billingPeriod: 'ANNUAL' // not required
                };
              }
              return acc;
            },
            {},
          ),
        },
      };
  }
}

function asCurrentSiteProviderResult(
  availableProductsProvider: ProviderResult<AvailableProductsResponse>,
  cloudId: string | null | undefined,
): ProviderResult<CurrentSiteResponse> {
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
          url: site.url,
          products: site.availableProducts,
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
  const resolvedLicenseInformation: ProviderResult<
    LicenseInformationResponse
  > = asLicenseInformationProviderResult(availableProducts, cloudId);
  const currentSite = asCurrentSiteProviderResult(availableProducts, cloudId);
  const hasLoadedAvailableProducts = hasLoaded(availableProducts);
  const hasLoadedAdminLinks =
    hasLoaded(managePermission) && hasLoaded(addProductsPermission);
  const hasLoadedSuggestedProducts = features.xflow
    ? hasLoaded(productRecommendations) && hasLoaded(isXFlowEnabled)
    : true;

  return {
    licensedProductLinks: collect(
      collectAvailableProductLinks(cloudId, availableProducts),
      [],
    ),
    suggestedProductLinks: features.xflow
      ? collect(
          collectSuggestedLinks(
            currentSite,
            productRecommendations,
            isXFlowEnabled,
          ),
          [],
        )
      : [],
    fixedLinks: collect(
      collectFixedProductLinks(
        product,
        features.isDiscoverMoreForEveryoneEnabled,
      ),
      [],
    ),
    adminLinks: collect(
      collectAdminLinks(
        managePermission,
        addProductsPermission,
        features.isDiscoverMoreForEveryoneEnabled,
        features.isEmceeLinkEnabled,
        product,
      ),
      [],
    ),
    recentLinks: collect(
      collectRecentLinks(recentContainers, resolvedLicenseInformation),
      [],
    ),
    customLinks: cloudId
      ? collect(collectCustomLinks(customLinks, currentSite), [])
      : [],

    showManageLink: collect(collectCanManageLinks(managePermission), false),
    hasLoaded:
      hasLoadedAvailableProducts &&
      hasLoadedAdminLinks &&
      hasLoadedSuggestedProducts,
    hasLoadedCritical: hasLoadedAvailableProducts,
  };
}
