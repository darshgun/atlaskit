// @flow
const flattenReleases = require('./../../flattenReleases');

const changesets = [
  {
    releases: [
      {
        name: 'packageA',
        type: 'patch',
      },
    ],
    commit: '234edfxsxsax',
    dependents: [{}],
  },
];
describe('flattenReleases >', () => {
  test('should flatten releases', async () => {
    const releasesFlatten = flattenReleases(changesets);
    expect(JSON.stringify(releasesFlatten)).toBe(
      `[{"name":"packageA","type":"patch","commits":["234edfxsxsax"]},{"name":"undefined","type":"none","commits":["234edfxsxsax"]}]`,
    );
  });
});
