import { Result, ConfluenceObjectResult, ResultType } from '../model/Result';
import { GasPayload } from '@atlaskit/analytics-gas-types';

export declare type ScreenEventSafeGasPayload = GasPayload & { name: string };

export const DEFAULT_GAS_SOURCE = 'globalSearchDrawer';
export const DEFAULT_GAS_CHANNEL = 'fabric-elements';
export const DEFAULT_GAS_ATTRIBUTES = {
  packageName: 'global-search',
  packageVersion: '0.0.0',
  componentName: 'GlobalQuickSearch',
};

export interface ShownAnalyticsAttributes {
  resultCount: number;
  resultSectionCount: number;
  resultContext: ShownResultContextSection[];
}

export interface ShownResultContextSection {
  sectionId: string;
  results: ShownResultContextItem[];
}

export interface ShownResultContextItem {
  resultContentId: string;
  resultType?: string;
  containerId?: string;
}

export interface PostQueryShownAttributes extends ShownAnalyticsAttributes {
  queryWordCount: number;
  queryCharacterCount: number;
}

export interface ResultSelectedAnalyticsDetails {
  resultContentId: string;
  resultType: string;
  section: string;
  sectionIndex: number;
  globalIndex: number;
  indexWithinSection: number;
}

export const sanitizeSearchQuery = query => {
  return (query || '').replace(/\s+/g, ' ').trim();
};

export const sanitizeContainerId = (containerId?): string => {
  const trimmedContainerId = (containerId || '').trim();
  return trimmedContainerId.startsWith('~') ? 'UNAVAILABLE' : trimmedContainerId;
}

function mapResultsToShownSection(
  results: Result[],
): ShownResultContextSection {
  return {
    sectionId: results[0].resultType,
    results: results.map(mapResultToShownResult),
  };
}

function mapResultToShownResult(result: Result): ShownResultContextItem {
  if (result.resultType === ResultType.ConfluenceObjectResult) {
    const confluenceResult = result as ConfluenceObjectResult;
    return {
      resultContentId: result.resultId,
      resultType: confluenceResult.contentType,
      containerId: sanitizeContainerId(confluenceResult.containerId),
    };
  }

  return {
    resultContentId: result.resultId,
  };
}

/**
 * @param resultsArrays an ordered array of Result arrays, passed as arguments
 */
export function buildShownEventDetails(
  ...resultsArrays: Result[][]
): ShownAnalyticsAttributes {
  const sectionsWithContent = resultsArrays.filter(
    section => section.length > 0,
  );
  const totalResultCount = resultsArrays.reduce(
    (prev, curr) => prev + curr.length,
    0,
  );

  return {
    resultCount: totalResultCount,
    resultSectionCount: sectionsWithContent.length,
    resultContext: sectionsWithContent.map(mapResultsToShownSection),
  };
}

export enum Screen {
  PRE_QUERY = 'GlobalSearchPreQueryDrawer',
  POST_QUERY = 'GlobalSearchPostQueryDrawer',
}

export function buildScreenEvent(
  screen: Screen,
  timesViewed: number,
  searchSessionId: string,
): ScreenEventSafeGasPayload {
  return {
    action: 'viewed',
    actionSubject: screen,
    eventType: 'screen',
    source: DEFAULT_GAS_SOURCE,
    name: DEFAULT_GAS_SOURCE,
    attributes: {
      subscreen: screen,
      timesViewed: timesViewed,
      searchSessionId: searchSessionId,
      ...DEFAULT_GAS_ATTRIBUTES,
    },
  };
}
