describe('create-data-provider', () => {
  const fetchJson = jest.fn().mockReturnValue(Promise.resolve());
  const withCached = jest.fn().mockImplementation(fn => fn);

  jest.doMock('../../../utils/fetch', () => ({ fetchJson }));
  jest.doMock('../../../utils/with-cached', () => ({ withCached }));

  const { createProvider } = require('../../create-data-provider');

  describe('by url', () => {
    test('should return a fetch method and a provider component', () => {
      const provider = createProvider('my-provider', '/gateway/api/content');
      expect(provider).toHaveProperty('fetchMethod');
      expect(provider).toHaveProperty('ProviderComponent');
    });

    test('should request data from the endpoint provided when the provider was created', () => {
      const providerA = createProvider(
        'my-provider-a',
        'http://my-api/content',
      );
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

  describe('by promise', () => {
    let promise: jest.Mock;

    beforeEach(() => {
      promise = jest.fn().mockResolvedValue(true);
    });

    test('should return a fetch method and a provider component', () => {
      const provider = createProvider('my-provider', promise);
      expect(provider).toHaveProperty('fetchMethod');
      expect(provider).toHaveProperty('ProviderComponent');
    });

    test('should invoke the promise when the provider was created', () => {
      const provider = createProvider('my-provider', promise);
      provider.fetchMethod();
      expect(promise).toBeCalled();
    });
  });
});
