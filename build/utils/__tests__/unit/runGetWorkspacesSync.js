const getWorkspacesSync = require('./../../getWorkspacesSync')
  .getWorkspacesSync;
const bolt = require('bolt');
const fs = require('fs');
const path = require('path');

describe('getWorkspacesSync >', () => {
  test('should return the same results as getWorkspaces', async () => {
    const resultsSync = getWorkspacesSync();
    const resultsAsync = await bolt.getWorkspaces();
    expect(resultsSync.length).toBe(resultsAsync.length);
    expect(resultsSync).toStrictEqual(resultsAsync);
  });
});
