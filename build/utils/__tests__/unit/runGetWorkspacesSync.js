const getWorkspacesSync = require('./../../getWorkspacesSync')
  .getWorkspacesSync;
const fs = require('fs');
const path = require('path');

describe('getWorkspacesSync >', () => {
  test('should return all the workspaces if running from the root with Bolt', () => {
    const results = getWorkspacesSync();
    expect(results.length).toBeGreaterThan(1);
  });
});
