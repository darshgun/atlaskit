// @flow
const flattenReleases = require('./../../flattenReleases');

describe('flattenReleases >', () => {
  test('should flatten releases', async () => {
    // TODO: write unit test.
    const releasesNotFlatten =
      'I am a commit message\nhello, I am the second line.\nhello, I am the 3 line.';
    const releasesFlatten = flattenReleases(releasesNotFlatten);

    expect(releasesFlatten).toBe('');
  });
});
