jest.enableAutomock();
import simpleGit from 'simple-git/promise';
import { push } from '../../../commands/push';
import fetch from 'node-fetch';
import * as gitUtil from '../../../lib/git';

jest.unmock('../../../commands/push');

const mockSimpleGit: jest.Mock = simpleGit as any;
const mockFetch: jest.Mock = fetch as any;

describe('Push command', () => {
  let mockGitMethods: any;
  let consoleLogSpy: jest.SpyInstance<
    ReturnType<Console['log']>,
    Parameters<Console['log']>
  >;

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
    mockSimpleGit.mockImplementation(() => mockGitMethods);
    mockFetch.mockImplementation(() => ({
      json: jest.fn(() => ({ author: { raw: 'Test <test@atlassian.com>' } })),
    }));
    // Comment out the mockImplementation to read console.logs for debugging
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  it('should create a new branch in product if one does not exist', async () => {
    expect(gitUtil.checkoutOrCreate).not.toHaveBeenCalled();
    await push('foo', 'abcdef123456', {});
    expect(gitUtil.checkoutOrCreate).toHaveBeenCalledWith(
      mockGitMethods,
      'atlaskit-branch-deploy-foo',
    );
  });
  it.skip('should reuse existing branch in product if one exists', () => {});
  it.skip('should install branch deployed versions from supplied commit hash', () => {});
  it.skip('should commit and push changes', () => {});
  it.skip('should gracefully exit if no new versions were installed', () => {});
  it.skip('should run dedupe if dedupe flag is passed', () => {});
  it.skip('should not execute git/fetch when running in dryRun mode', () => {});
  it.skip('should log progress to the console', () => {});
  describe('Branch names', () => {
    it.skip('should use a custom branch prefix if one supplied', () => {});
    it.skip('should replace slashes in branch names with dashes', () => {});
  });
  describe('Validation', () => {
    it.skip('should error if atlaskitBranchName or atlaskitCommitHash flags are missing', () => {});
    it.skip('should error if invalid flags are passed', () => {});
    it.skip('should error if running inside atlaskit-mk-2 repo', () => {});
  });
  describe('Triggering product CI', () => {
    it.skip('should trigger if productCiPlanUrl flag passed', () => {});
    it.skip('should error if missing auth env variables', () => {});
    it.skip('should create branch build if one does not already exist', () => {});
    it.skip('should not create branch build if one already exists', () => {});
    it.skip('should error if creating branch build fails', () => {});
  });
});
