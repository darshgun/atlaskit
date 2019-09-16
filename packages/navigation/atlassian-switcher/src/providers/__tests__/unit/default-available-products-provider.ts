describe('default-available-products-provider', () => {
  const createProvider = jest.fn();

  jest.doMock('../../create-data-provider', () => ({ createProvider }));

  test('should create a provider using the internal url (/gateway) by default', () => {
    const {
      createAvailableProductsProvider,
    } = require('../../default-available-products-provider');
    createAvailableProductsProvider();
    expect(createProvider).toBeCalledWith(
      'availableProducts',
      '/gateway/api/worklens/api/available-products',
    );
  });

  test('should allow to create a provider with custom endpoint url', () => {
    const {
      createAvailableProductsProvider,
    } = require('../../default-available-products-provider');
    createAvailableProductsProvider('http://my-api/api/content');
    expect(createProvider).toBeCalledWith(
      'availableProducts',
      'http://my-api/api/content',
    );
  });
});
