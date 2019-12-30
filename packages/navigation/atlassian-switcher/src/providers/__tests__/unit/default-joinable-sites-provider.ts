describe('default-joinabble-sites-provider', () => {
  const createProviderWithCustomFetchData = jest.fn();

  jest.doMock('../../create-data-provider', () => ({
    createProviderWithCustomFetchData,
  }));

  test('should create a provider (returns empty sites) by default', () => {
    const {
      createJoinableSitesProvider,
      fetchEmptyData,
    } = require('../../default-joinable-sites-provider');
    createJoinableSitesProvider();
    expect(createProviderWithCustomFetchData).toBeCalledWith(
      'joinableSites',
      fetchEmptyData,
    );
  });

  test('should allow to create a provider with custom endpoint url', () => {
    const {
      createJoinableSitesProvider,
    } = require('../../default-joinable-sites-provider');
    const promise = () =>
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
