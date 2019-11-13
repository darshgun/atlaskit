// @flow
const bolt = require('bolt');
const fs = require('fs');
const path = require('path');
const { getWorkspacesSync } = require('./../../getWorkspacesSync');

describe('getWorkspacesSync >', () => {
  test('should return the same results as getWorkspaces', async () => {
    const resultsSync = getWorkspacesSync();
    const resultsAsync = await bolt.getWorkspaces();

    expect(resultsSync.length).toBe(resultsAsync.length);

    console.log();

    expect(resultsSync).toEqual(expect.arrayContaining(resultsAsync));
    // expect(resultsSync).toStrictEqual(resultsAsync);
  });
});
