import { createResource } from '../../../../../../controllers/resource-utils';
import { getResourceIdentifier } from '../../../../../../controllers/resource-store/utils/get-resource-identifier';

const getDataPromise = Promise.resolve();
const type = 'my-cool-type';
const key = 'Ky';
const mockResource = createResource({
  type,
  getKey: () => key,
  getData: () => getDataPromise,
});
const mockMatch = {
  params: {},
  query: {},
  isExact: false,
  path: '',
  url: '',
};
const mockRouterStoreContext = {
  route: null,
  match: mockMatch,
  query: {},
  location: { pathname: '', search: '', hash: '' },
};

const mockResourceStoreContex = { foo: 'bar' };

describe('getResourceIdentifier', () => {
  it('should return the type and key as a concatenated string', () => {
    expect(
      getResourceIdentifier(
        mockResource,
        mockRouterStoreContext,
        mockResourceStoreContex,
      ),
    ).toEqual(`${type}/${key}`);
  });
});
