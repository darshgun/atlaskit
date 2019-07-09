import fetchMock from 'fetch-mock';
import ConfluenceClient, {
  RecentPage,
  RecentSpace,
} from '../../api/ConfluenceClient';
import {
  AnalyticsType,
  ContainerResult,
  ContentType,
  ResultType,
} from '../../model/Result';
import {
  buildMockPage,
  DUMMY_CONFLUENCE_HOST,
  mockRecentlyViewedPages,
  mockRecentlyViewedSpaces,
  MOCK_SPACE,
} from './helpers/_confluence-client-mocks';

describe('ConfluenceClient', () => {
  let confluenceClient: ConfluenceClient;

  beforeEach(() => {
    confluenceClient = new ConfluenceClient(DUMMY_CONFLUENCE_HOST);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('getRecentItems', () => {
    it('should return confluence items', async () => {
      const pages: RecentPage[] = [
        buildMockPage('page'),
        buildMockPage('blogpost'),
      ];

      mockRecentlyViewedPages(pages);

      const result = await confluenceClient.getRecentItems();

      expect(result).toEqual([
        {
          resultId: pages[0].id + '',
          name: pages[0].title,
          href: `${DUMMY_CONFLUENCE_HOST}${pages[0].url}`,
          containerName: pages[0].space,
          analyticsType: AnalyticsType.RecentConfluence,
          resultType: ResultType.ConfluenceObjectResult,
          contentType: ContentType.ConfluencePage,
          containerId: 'abc',
          iconClass: 'iconClass',
          isRecentResult: true,
        },
        {
          resultId: pages[1].id + '',
          name: pages[1].title,
          href: `${DUMMY_CONFLUENCE_HOST}${pages[1].url}`,
          containerName: pages[1].space,
          analyticsType: AnalyticsType.RecentConfluence,
          resultType: ResultType.ConfluenceObjectResult,
          contentType: ContentType.ConfluenceBlogpost,
          containerId: 'abc',
          iconClass: 'iconClass',
          isRecentResult: true,
        },
      ]);
    });

    it('should not break if no results are returned', async () => {
      mockRecentlyViewedPages([]);
      const result = await confluenceClient.getRecentItems();
      expect(result).toEqual([]);
    });
  });

  describe('getRecentSpaces', () => {
    it('should return confluence spaces', async () => {
      const spaces: RecentSpace[] = [MOCK_SPACE, MOCK_SPACE];

      mockRecentlyViewedSpaces(spaces);

      const result = await confluenceClient.getRecentSpaces();

      const expectedResults: ContainerResult[] = [
        {
          resultId: MOCK_SPACE.id,
          name: MOCK_SPACE.name,
          href: `${DUMMY_CONFLUENCE_HOST}/spaces/${MOCK_SPACE.key}/overview`,
          avatarUrl: MOCK_SPACE.icon,
          analyticsType: AnalyticsType.RecentConfluence,
          resultType: ResultType.GenericContainerResult,
          contentType: ContentType.ConfluenceSpace,
        },
        {
          resultId: MOCK_SPACE.id,
          name: MOCK_SPACE.name,
          href: `${DUMMY_CONFLUENCE_HOST}/spaces/${MOCK_SPACE.key}/overview`,
          avatarUrl: MOCK_SPACE.icon,
          analyticsType: AnalyticsType.RecentConfluence,
          resultType: ResultType.GenericContainerResult,
          contentType: ContentType.ConfluenceSpace,
        },
      ];

      expect(result).toEqual(expectedResults);
    });

    it('should not break if no spaces are returned', async () => {
      mockRecentlyViewedSpaces([]);
      const result = await confluenceClient.getRecentSpaces();
      expect(result).toEqual([]);
    });
  });
});
