import fetchMock from 'fetch-mock';
import {
  fetchJoinableSites,
  transformExperimentSitesToSwitcherSites,
} from '../../default-joinable-sites-fetch';
import { ProductKey } from '../../../types';

describe('default-joinable-sites-fetch', () => {
  const experimentApiSites = {
    sites: [
      {
        cloudId: 'cloud-1',
        url: 'https://teamsinspace.com',
        products: {
          'jira-software.ondemand': [],
        },
        displayName: 'Example',
        avatarUrl: 'http://avatarSite/avatar',
        relevance: 0,
      },
    ],
  };

  const expectedTransformation = {
    sites: [
      {
        cloudId: 'cloud-1',
        url: 'https://teamsinspace.com',
        users: {
          'jira-software.ondemand': [],
        },
        displayName: 'Example',
        avatarUrl: 'http://avatarSite/avatar',
        relevance: 0,
      },
    ],
  };

  describe('fetch', () => {
    test('should return error when fetch could not retrieve data', async () => {
      fetchMock.post(`/trello-cross-product-join/recommended-sites`, 400);

      // Apparently you have to wrap in a try catch -> https://github.com/facebook/jest/issues/1700
      async function testFetch() {
        try {
          await fetchJoinableSites([ProductKey.JIRA_SOFTWARE]);
        } catch (e) {
          throw new Error('testFetchError');
        }
      }

      await expect(testFetch()).rejects.toThrow(Error);
    });

    test('should return transformed joinable sites when fetch succeeds', async () => {
      fetchMock.post(
        `/trello-cross-product-join/recommended-sites`,
        experimentApiSites,
        { method: 'POST', overwriteRoutes: true },
      );

      const joinableSites = await fetchJoinableSites([
        ProductKey.JIRA_SOFTWARE,
      ]);
      expect(joinableSites).toStrictEqual(expectedTransformation);
    });
  });

  describe('transform', () => {
    test('should transform experiment sites with no collaborators properly', () => {
      const transformedSites = transformExperimentSitesToSwitcherSites(
        experimentApiSites,
      );
      expect(transformedSites).toStrictEqual(expectedTransformation);
    });

    test('should transform empty sites as is', () => {
      const experimentApiSites = {
        sites: [],
      };
      const expectedTransformation = {
        sites: [],
      };
      const transformedSites = transformExperimentSitesToSwitcherSites(
        experimentApiSites,
      );
      expect(transformedSites).toStrictEqual(expectedTransformation);
    });
  });
});
