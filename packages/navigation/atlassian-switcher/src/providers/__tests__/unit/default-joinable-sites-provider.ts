import { JoinableSiteDataFetcher } from '../../default-joinable-sites-provider';

describe('default-joinabble-sites-provider', () => {
  const createProviderWithCustomFetchData = jest.fn();

  jest.doMock('../../create-data-provider', () => ({
    createProviderWithCustomFetchData,
  }));

  test('should create a provider using the internal url (/gateway) by default', () => {
    const {
      createJoinableSitesProvider,
      defaultFetchData,
    } = require('../../default-joinable-sites-provider');
    createJoinableSitesProvider();
    expect(createProviderWithCustomFetchData).toBeCalledWith(
      'joinableSites',
      defaultFetchData,
    );
  });

  test('should allow to create a provider with custom endpoint url', () => {
    const {
      createJoinableSitesProvider,
    } = require('../../default-joinable-sites-provider');
    const promise: JoinableSiteDataFetcher = () =>
      new Promise(resolve => ({
        sites: [],
      }));
    createJoinableSitesProvider(promise);
    expect(createProviderWithCustomFetchData).toBeCalledWith(
      'joinableSites',
      promise,
    );
  });
});
