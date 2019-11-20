// @flow
const parseChangesetCommit = require('./../../parseChangesetCommit');

describe('parseChangesetCommit >', () => {
  test('should parse commit', async () => {
    const commitNotParsed = `\n---\n"{commit:'I am a commit message.',\ncommit2:hello, I am the second line.,\ncommit3:hello, I am the 3 line.,\ncommit4:hello, again}"\n---`;
    const commitParsed = parseChangesetCommit(commitNotParsed);

    expect(commitParsed).toBe(
      `{commit:'I am a commit message.',commit2:hello, I am the second line.,commit3:hello, I am the 3 line.,commit4:hello, again}`,
    );
  });
});
