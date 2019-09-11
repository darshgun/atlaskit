describe('utils/prefetch', () => {
  const prefetchAll = jest.fn();
  const prefetchAvailableProducts = jest.fn();
  const prefetchSwitcherBundles = jest.fn();

  jest.doMock('../../providers/instance-data-providers', () => ({
    prefetchAll,
  }));
  jest.doMock('../../providers/products-data-provider', () => ({
    prefetchAvailableProducts,
  }));
  jest.doMock('../../utils/prefetch-bundles', () => prefetchSwitcherBundles);

  const { prefetch } = require('../../prefetch');

  beforeEach(() => {
    prefetchAll.mockReset();
    prefetchAvailableProducts.mockReset();
    prefetchSwitcherBundles.mockReset();
  });

  it('should prefetch bundles', () => {
    const props = {
      product: 'any',
    };
    prefetch(props);
    expect(prefetchSwitcherBundles).toHaveBeenCalledTimes(1);
    expect(prefetchSwitcherBundles).toHaveBeenCalledWith('any');
  });

  it('should prefetch the data providers only if cloud id is passed down', () => {
    prefetch({});
    expect(prefetchAll).toHaveBeenCalledTimes(0);

    prefetch({
      cloudId: 'some-cloud-id',
    });

    expect(prefetchAll).toHaveBeenCalledTimes(1);

    expect(prefetchAll).toHaveBeenCalledWith({
      cloudId: 'some-cloud-id',
    });
  });

  it('should prefetch available products if user centric mode is turned on', () => {
    prefetch({});
    expect(prefetchAvailableProducts).toHaveBeenCalledTimes(0);

    prefetch({
      enableUserCentricProducts: true,
    });

    expect(prefetchAvailableProducts).toHaveBeenCalledTimes(1);
  });
});
