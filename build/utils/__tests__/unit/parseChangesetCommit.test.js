// @flow
const parseChangesetCommit = require('./../../parseChangesetCommit');

describe('parseChangesetCommit >', () => {
  test('should parse commit', async () => {
    // TODO: write unit test.
    const commitNotParsed =
      'I am a commit message\nhello, I am the second line.\nhello, I am the 3 line.';
    const commitParsed = parseChangesetCommit(commitNotParsed);

    expect(commitParsed).toBe('');
  });
});
