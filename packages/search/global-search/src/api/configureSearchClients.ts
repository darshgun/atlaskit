import CachingConfluenceClient from './CachingConfluenceClient';
import { CachingPeopleSearchClient } from './CachingPeopleSearchClient';
import { ConfluenceClient } from './ConfluenceClient';
import CrossProductSearchClientImpl, {
  CrossProductSearchClient,
} from './CrossProductSearchClient';
import JiraClientImpl, { JiraClient } from './JiraClient';
import { PeopleSearchClient } from './PeopleSearchClient';
import {
  ConfluencePrefetchedResults,
  GlobalSearchPrefetchedResults,
} from './prefetchResults';
import RecentSearchClientImpl, {
  RecentSearchClient,
} from './RecentSearchClient';
import {
  AutoCompleteClientImpl,
  AutoCompleteClient,
} from './AutoCompleteClient';

export interface SearchClients {
  recentSearchClient: RecentSearchClient;
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  jiraClient: JiraClient;
  autocompleteClient: AutoCompleteClient;
}

export interface Config {
  activityServiceUrl: string;
  searchAggregatorServiceUrl: string;
  directoryServiceUrl: string;
  confluenceUrl: string;
  jiraUrl: string;
  autocompleteUrl: string;
  addSessionIdToJiraResult?: boolean;
}

const defaultConfig: Config = {
  activityServiceUrl: '/gateway/api/activity',
  searchAggregatorServiceUrl: '/gateway/api/xpsearch-aggregator',
  directoryServiceUrl: '/gateway/api/directory',
  confluenceUrl: '/wiki',
  jiraUrl: '',
  autocompleteUrl: '/gateway/api/xpsearch-autocomplete',
  addSessionIdToJiraResult: false,
};

export default function configureSearchClients(
  cloudId: string,
  partialConfig: Partial<Config>,
  prefetchedResults?: GlobalSearchPrefetchedResults,
): SearchClients {
  const config = {
    ...defaultConfig,
    ...partialConfig,
  };

  const confluencePrefetchedResults =
    prefetchedResults &&
    (<ConfluencePrefetchedResults>prefetchedResults)
      .confluenceRecentItemsPromise
      ? (<ConfluencePrefetchedResults>prefetchedResults)
          .confluenceRecentItemsPromise
      : undefined;

  return {
    recentSearchClient: new RecentSearchClientImpl(
      config.activityServiceUrl,
      cloudId,
    ),
    crossProductSearchClient: new CrossProductSearchClientImpl(
      config.searchAggregatorServiceUrl,
      cloudId,
      config.addSessionIdToJiraResult,
    ),
    peopleSearchClient: new CachingPeopleSearchClient(
      config.directoryServiceUrl,
      cloudId,
      prefetchedResults ? prefetchedResults.recentPeoplePromise : undefined,
    ),
    confluenceClient: new CachingConfluenceClient(
      config.confluenceUrl,
      cloudId,
      confluencePrefetchedResults,
    ),
    jiraClient: new JiraClientImpl(
      config.jiraUrl,
      cloudId,
      config.addSessionIdToJiraResult,
    ),
    autocompleteClient: new AutoCompleteClientImpl(
      config.autocompleteUrl,
      cloudId,
    ),
  };
}
