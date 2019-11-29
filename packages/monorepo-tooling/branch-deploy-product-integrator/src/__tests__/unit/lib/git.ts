jest.enableAutomock();

import * as gitUtils from '../../../lib/git';

jest.unmock('../../../lib/git');

describe('Git utils', () => {
  let mockGitMethods: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockGitMethods = {
      add: jest.fn(),
      checkout: jest.fn(),
      checkoutBranch: jest.fn(),
      commit: jest.fn(),
      listRemote: jest.fn(() => 'foo'),
      pull: jest.fn(),
      push: jest.fn(),
      revparse: jest.fn(),
      status: jest.fn(() => ({ staged: [] })),
    };
  });
  describe('checkoutOrCreate', () => {
    it('should create a new branch if one does not exist', async () => {
      expect(mockGitMethods.checkoutBranch).not.toHaveBeenCalled();
      await gitUtils.checkoutOrCreate(
        {
          ...mockGitMethods,
          revparse: () => {
            throw Error();
          },
        },
        'foo',
      );
      expect(mockGitMethods.checkoutBranch).toHaveBeenCalledWith(
        'foo',
        'origin/master',
      );
    });
  });
});
