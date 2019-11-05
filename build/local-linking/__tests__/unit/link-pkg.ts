jest.enableAutomock();
import path from 'path';
import fse from 'fs-extra';
import * as bolt from 'bolt';
import * as yalc from 'yalc';
import { prefixConsoleLog } from '@atlaskit/build-utils/logging';
import runCommands from '@atlaskit/build-utils/runCommands';
import linkPkg from '../../link-pkg';

jest.mock('fs-extra');
jest.unmock('../../link-pkg');
// These util functions need to be unmocked so core functionality works
jest.unmock('../../utils');
jest.unmock('@atlaskit/build-utils/errors');

const mockedFse: any = fse;
const mockedBolt: any = bolt;

describe('Link Pkg', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedBolt.getProject.mockImplementation(() => ({
      dir: 'projects/repo',
      name: 'project',
      config: {},
    }));
    mockedBolt.getWorkspaces.mockImplementation(() => [
      {
        name: 'bar',
        dir: 'packages/bar',
        config: {},
      },
    ]);
    mockedFse.pathExists.mockImplementation(() => false);
    mockedFse.readJson.mockImplementation(() => ({}));

    // Mock to return a function as the impl returns an unsubscribe fn that is called
    (prefixConsoleLog as any).mockImplementation(() => () => {});
  });

  it('should run yalc publish in each package directory', async () => {
    const spy = jest.spyOn(yalc, 'publishPackage');
    await linkPkg('../repo-foo', ['bar']);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      workingDir: 'packages/bar',
    });
    spy.mockRestore();
  });

  it('should run yalc add in the target repo after publishing', async () => {
    const spy = jest.spyOn(yalc, 'addPackages');
    await linkPkg('../repo-foo', ['bar']);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['bar'], {
      workingDir: path.resolve('projects/repo-foo'),
      pure: false,
    });
    spy.mockRestore();
  });

  it('should run npm to install transitive dependencies in standard repo', async () => {
    await linkPkg('../repo-foo', ['bar']);
    expect(runCommands).toHaveBeenCalledTimes(1);
    expect(runCommands).toHaveBeenCalledWith(
      [
        expect.stringMatching(
          /cd ".*\/projects\/repo-foo" && unset PREFIX && unset \${!npm_@} && unset YARN_IGNORE_PATH && source "\$NVM_DIR\/nvm.sh" && nvm deactivate && nvm use && NODE="\$NVM_BIN\/node" npm install/,
        ),
      ],
      {
        linePrefix: 'Installing deps:',
        stripAnsi: true,
      },
    );
  });

  it('should run yarn to install transitive dependencies in yarn repo', async () => {
    mockedFse.pathExists.mockImplementation((p: string) =>
      p.includes('yarn.lock'),
    );
    await linkPkg('../repo-foo', ['bar']);
    expect(runCommands).toHaveBeenCalledTimes(1);
    expect(runCommands).toHaveBeenCalledWith(
      [
        expect.stringMatching(
          /cd ".*\/projects\/repo-foo" && unset PREFIX && unset \${!npm_@} && unset YARN_IGNORE_PATH && source "\$NVM_DIR\/nvm.sh" && nvm deactivate && nvm use && NODE="\$NVM_BIN\/node" yarn/,
        ),
      ],
      {
        linePrefix: 'Installing deps:',
        stripAnsi: true,
      },
    );
  });

  it('should run bolt to install transitive dependencies in bolt repos', async () => {
    mockedFse.pathExists.mockImplementation((p: string) =>
      p.includes('yarn.lock'),
    );
    mockedFse.readJson.mockImplementation(() => ({ bolt: {} }));
    await linkPkg('../repo-foo', ['bar']);
    expect(runCommands).toHaveBeenCalledTimes(1);

    expect(runCommands).toHaveBeenCalledWith(
      [
        expect.stringMatching(
          /cd ".*\/projects\/repo-foo" && unset PREFIX && unset \${!npm_@} && unset YARN_IGNORE_PATH && source "\$NVM_DIR\/nvm.sh" && nvm deactivate && nvm use && NODE="\$NVM_BIN\/node" bolt add bar@file:.yalc\/bar/,
        ),
      ],
      {
        linePrefix: 'Installing deps:',
        stripAnsi: true,
      },
    );
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      mockedBolt.getWorkspaces.mockReset();
      mockedBolt.getWorkspaces.mockImplementation(() => [
        {
          name: 'bar',
          dir: 'packages/bar',
          config: {},
        },
        {
          name: '@atlaskit/foo',
          dir: 'packages/foo',
          config: {},
        },
      ]);
    });

    it('should not run nvm commands when nvm option is false', async () => {
      await linkPkg('../repo-foo', ['bar'], { nvm: false });
      expect(runCommands).toHaveBeenCalledTimes(1);
      expect(runCommands).toHaveBeenCalledWith(
        [expect.stringMatching(/cd ".*\/projects\/repo-foo" && npm install/)],
        {
          linePrefix: 'Installing deps:',
          stripAnsi: true,
        },
      );
    });

    it('should run yalc add with pure mode in bolt repos and then re-run without pure mode', async () => {
      mockedFse.pathExists.mockImplementation((p: string) =>
        p.includes('yarn.lock'),
      );
      mockedFse.readJson.mockImplementation(() => ({ bolt: {} }));
      const spy = jest.spyOn(yalc, 'addPackages');
      await linkPkg('../repo-foo', ['bar']);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, ['bar'], {
        workingDir: path.resolve('projects/repo-foo'),
        pure: true,
      });
      expect(spy).toHaveBeenNthCalledWith(2, ['bar'], {
        workingDir: path.resolve('projects/repo-foo'),
        pure: false,
      });
      spy.mockRestore();
    });

    it('should handle both full package name and shortened package name', async () => {
      const publishSpy = jest.spyOn(yalc, 'publishPackage');
      const addSpy = jest.spyOn(yalc, 'addPackages');

      async function testPkg(name: string) {
        publishSpy.mockClear();
        addSpy.mockClear();

        await linkPkg('../repo-foo', [name]);
        expect(publishSpy).toHaveBeenCalledTimes(1);
        expect(publishSpy).toHaveBeenCalledWith({ workingDir: 'packages/foo' });

        expect(addSpy).toBeCalledTimes(1);
        expect(addSpy).toHaveBeenCalledWith(['@atlaskit/foo'], {
          pure: false,
          workingDir: path.resolve('projects/repo-foo'),
        });
      }

      await testPkg('foo');
      await testPkg('@atlaskit/foo');

      publishSpy.mockRestore();
      addSpy.mockRestore();
    });

    it('should work for multiple packages', async () => {
      const publishSpy = jest.spyOn(yalc, 'publishPackage');
      const addSpy = jest.spyOn(yalc, 'addPackages');

      await linkPkg('../repo-foo', ['foo', 'bar']);

      expect(publishSpy).toHaveBeenCalledTimes(2);
      expect(publishSpy).toHaveBeenCalledWith({ workingDir: 'packages/foo' });
      expect(publishSpy).toHaveBeenCalledWith({ workingDir: 'packages/bar' });
      expect(addSpy).toBeCalledTimes(1);
      expect(addSpy).toHaveBeenCalledWith(['@atlaskit/foo', 'bar'], {
        pure: false,
        workingDir: path.resolve('projects/repo-foo'),
      });

      publishSpy.mockRestore();
      addSpy.mockRestore();
    });
  });

  describe('Validation', () => {
    it('should throw if no repo arg passed', async () => {
      // @ts-ignore
      const check = async () => await linkPkg();

      await expect(check()).rejects.toThrow(
        'Must specify repoPath and at least one package',
      );
    });

    it('should throw if no package arg passed', async () => {
      // @ts-ignore
      const check = async () => await linkPkg('../repo-foo');

      await expect(check()).rejects.toThrow(
        'Must specify repoPath and at least one package',
      );

      const checkAgain = async () => await linkPkg('../repo-foo', []);

      await expect(checkAgain()).rejects.toThrow(
        'Must specify repoPath and at least one package',
      );
    });

    it('should throw if invalid package name passed', async () => {
      const check = async () =>
        await linkPkg('../repo-foo', ['package-name-does-not-exist']);

      await expect(check()).rejects.toThrow(
        'Could not find the following packages: package-name-does-not-exist\nProvide either full name (@atlaskit/foo) or unscoped name (foo).',
      );
    });
  });
});
