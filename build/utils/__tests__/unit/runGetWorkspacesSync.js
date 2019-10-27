const getWorkspacesSync = require('./../../getWorkspacesSync')
  .getWorkspacesSync;
const fs = require('fs');
const path = require('path');

const optsRoot = {
  cwd: process.cwd(),
  tools: 'root',
};

const optsBolt = {
  cwd: process.cwd(),
  tools: 'bolt',
};

const optsYarn = {
  cwd: process.cwd(),
  tools: 'yarn',
};

describe('getWorkspacesSync >', () => {
  test('should return the root package.json', () => {
    const results = getWorkspacesSync(optsRoot);
    const rootPkgJason = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
    );
    expect(results[0].config.name).toBe(rootPkgJason.name);
  });
  test('should return all the workspaces if running from the root with Bolt', () => {
    const results = getWorkspacesSync(optsBolt);
    expect(results.length).toBeGreaterThan(1);
  });
  test.only('should not return any workspaces if running from the root with Yarn', () => {
    const results = getWorkspacesSync(optsYarn);
    expect(results).toBe(null);
  });
});
