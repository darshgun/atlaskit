// @flow
const bolt = require('bolt');
const { getWorkspacesSync } = require('./../../getWorkspacesSync');

describe('getWorkspacesSync >', () => {
  test('should return the same results as getWorkspaces', async () => {
    const resultsSync = getWorkspacesSync();
    const resultsAsync = await bolt.getWorkspaces();

    expect(resultsSync.length).toBe(resultsAsync.length);
    expect(resultsSync).toEqual(expect.arrayContaining(resultsAsync));
  });
});
