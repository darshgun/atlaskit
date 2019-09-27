import path from 'path';
import fse from 'fs-extra';
import * as bolt from 'bolt';
import * as yalc from 'yalc';
import runCommands from '@atlaskit/build-utils/runCommands';
import portal from '../../portal';

jest.enableAutomock();
jest.mock('fs-extra');
jest.unmock('../portal');

const mockedFse: any = fse;

describe('portal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    bolt.getProject.mockImplementation(() => ({
      dir: 'projects/repo',
      name: 'project',
      config: {},
    }));
    bolt.getWorkspaces.mockImplementation(() => [
      {
        name: 'bar',
        dir: 'packages/bar',
        config: {},
      },
    ]);
    mockedFse.pathExists.mockImplementation(() => false);
    mockedFse.readJson.mockImplementation(() => ({}));
  });

  it('should run yalc publish in each package directory', async () => {
    const spy = jest.spyOn(yalc, 'publishPackage');
    await portal('repo-foo', ['bar']);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      workingDir: 'packages/bar',
    });
    spy.mockRestore();
  });

  it('should run yalc add in the target repo after publishing', async () => {
    const spy = jest.spyOn(yalc, 'addPackages');
    await portal('repo-foo', ['bar']);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['bar'], {
      workingDir: path.resolve('projects/repo-foo'),
    });
    spy.mockRestore();
  });

  it('should run npm to install transitive dependencies in standard repo', async () => {
    await portal('repo-foo', ['bar']);
    expect(runCommands).toHaveBeenCalledTimes(1);
    expect(runCommands).toHaveBeenCalledWith(['nvm use && npm install']);
  });

  it('should run yarn to install transitive dependencies in yarn repo', async () => {
    mockedFse.pathExists.mockImplementation((p: string) =>
      p.includes('yarn.lock'),
    );
    await portal('repo-foo', ['bar']);
    expect(runCommands).toHaveBeenCalledTimes(1);
    expect(runCommands).toHaveBeenCalledWith(['nvm use && yarn']);
  });

  it('should run bolt to install transitive dependencies in bolt repos', async () => {
    mockedFse.pathExists.mockImplementation((p: string) =>
      p.includes('yarn.lock'),
    );
    mockedFse.readJson.mockImplementation((p: string) => ({ bolt: {} }));
    await portal('repo-foo', ['bar']);
    expect(runCommands).toHaveBeenCalledTimes(1);
    expect(runCommands).toHaveBeenCalledWith([
      'nvm use && bolt upgrade bar@file:.yalc/bar',
    ]);
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      bolt.getWorkspaces.mockReset();
      bolt.getWorkspaces.mockImplementation(() => [
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

    it('should handle both full package name and shortened package name', async () => {
      const publishSpy = jest.spyOn(yalc, 'publishPackage');
      const addSpy = jest.spyOn(yalc, 'addPackages');

      async function testPkg(name: string) {
        publishSpy.mockClear();
        addSpy.mockClear();

        await portal('repo-foo', [name]);
        expect(publishSpy).toHaveBeenCalledTimes(1);
        expect(publishSpy).toHaveBeenCalledWith({ workingDir: 'packages/foo' });

        expect(addSpy).toBeCalledTimes(1);
        expect(addSpy).toHaveBeenCalledWith(['@atlaskit/foo'], {
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

      await portal('repo-foo', ['foo', 'bar']);

      expect(publishSpy).toHaveBeenCalledTimes(2);
      expect(publishSpy).toHaveBeenCalledWith({ workingDir: 'packages/foo' });
      expect(publishSpy).toHaveBeenCalledWith({ workingDir: 'packages/bar' });
      expect(addSpy).toBeCalledTimes(1);
      expect(addSpy).toHaveBeenCalledWith(['@atlaskit/foo', 'bar'], {
        workingDir: path.resolve('projects/repo-foo'),
      });

      publishSpy.mockRestore();
      addSpy.mockRestore();
    });
  });

  describe('Validation', () => {
    it('should throw if no repo arg passed', async () => {
      // @ts-ignore
      const check = async () => await portal();

      await expect(check()).rejects.toThrow(
        'Must specify repoPath and at least one package',
      );
    });

    it('should throw if no package arg passed', async () => {
      // @ts-ignore
      const check = async () => await portal('repo-foo');

      await expect(check()).rejects.toThrow(
        'Must specify repoPath and at least one package',
      );

      const checkAgain = async () => await portal('repo-foo', []);

      await expect(checkAgain()).rejects.toThrow(
        'Must specify repoPath and at least one package',
      );
    });

    it('should throw if invalid package name passed', async () => {
      const check = async () =>
        await portal('repo-foo', ['package-name-does-not-exist']);

      await expect(check()).rejects.toThrow(
        'Could not find the following packages: package-name-does-not-exist\nProvide either full name (@atlaskit/foo) or unscoped name (foo).',
      );
    });
  });
});
