describe('create-data-provider', () => {
  const fetchJson = jest.fn().mockReturnValue(Promise.resolve());
  const withCached = jest.fn().mockImplementation(fn => fn);

  jest.doMock('../../../utils/fetch', () => ({ fetchJson }));
  jest.doMock('../../../utils/with-cached', () => ({ withCached }));

  const { createProvider } = require('../../create-data-provider');

  test('should return a fetch method and a provider component', () => {
    const provider = createProvider('my-provider', '/gateway/api/content');
    expect(provider).toHaveProperty('fetchMethod');
    expect(provider).toHaveProperty('providerComponent');
  });

  test('should request data from the endpoint provided when the provider was created', () => {
    const providerA = createProvider('my-provider-a', 'http://my-api/content');
    providerA.fetchMethod();

    expect(fetchJson).toBeCalledWith('http://my-api/content');

    const providerB = createProvider(
      'my-provider-a',
      '/gateway/my-api/content',
    );
    providerB.fetchMethod();

    expect(fetchJson).toBeCalledWith('/gateway/my-api/content');
  });
});
