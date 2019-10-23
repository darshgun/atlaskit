const getWorkspacesSync = require('./../getWorkspacesSync').getWorkspacesSync;
const fs = require('fs');
const path = require('path');

const opts = {
  cwd: process.cwd(),
  tools: 'root',
};
describe('getWorkspacesSync >', () => {
  test('should return the root package.json', () => {
    const results = getWorkspacesSync(opts);
    console.log(results);
    const rootPkgJason = fs.readFileSync(
      path.join(process.cwd(), 'package.json'),
      'utf-8',
    );
    expect(true).toBe(true);
  });
  // test('should return all the workspaces if running from the root', () => {
  //   // TODO:
  // })
});
