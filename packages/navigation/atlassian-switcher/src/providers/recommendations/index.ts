import {
  ProductKey,
  RecommendationItem,
  RecommendationsFeatureFlags,
} from '../../types';

import {
  jswOgExpandsExperiment,
  productStoreRecommendation,
} from './experiments';

function baseRecommendation(): RecommendationItem[] {
  return [
    { productKey: ProductKey.JIRA_SOFTWARE },
    { productKey: ProductKey.CONFLUENCE },
    { productKey: ProductKey.JIRA_SERVICE_DESK },
    { productKey: ProductKey.OPSGENIE },
  ];
}

export function resolveRecommendations(
  featureFlags?: RecommendationsFeatureFlags,
): RecommendationItem[] {
  if (!featureFlags) {
    return baseRecommendation();
  }

  if (
    jswOgExpandsExperiment.showFeatureFlagVariation(
      featureFlags[jswOgExpandsExperiment.flagKey],
    )
  ) {
    return jswOgExpandsExperiment.recommendations();
  }

  if (featureFlags.isDiscoverSectionEnabled) {
    return productStoreRecommendation();
  }

  return baseRecommendation();
}
