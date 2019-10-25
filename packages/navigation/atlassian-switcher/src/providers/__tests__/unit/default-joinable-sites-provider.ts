import { JoinableSiteDataSource } from '../../default-joinable-sites-provider';

describe('default-joinabble-sites-provider', () => {
  const createProvider = jest.fn();

  jest.doMock('../../create-data-provider', () => ({ createProvider }));

  test('should create a provider using the internal url (/gateway) by default', () => {
    const {
      createJoinableSitesProvider,
      defaultDataSource,
    } = require('../../default-joinable-sites-provider');
    createJoinableSitesProvider();
    expect(createProvider).toBeCalledWith('joinableSites', defaultDataSource);
  });

  test('should allow to create a provider with custom endpoint url', () => {
    const {
      createJoinableSitesProvider,
    } = require('../../default-joinable-sites-provider');
    const promise: JoinableSiteDataSource = () =>
      new Promise(resolve => ({
        sites: [],
      }));
    createJoinableSitesProvider(promise);
    expect(createProvider).toBeCalledWith('joinableSites', promise);
  });
});
