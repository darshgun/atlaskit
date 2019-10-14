import path from 'path';
import fs from 'fs';
import { getFixturePath, createTempDir, copyDir } from 'jest-fixtures';
import linkAk from '../../link-ak';
import * as yalc from 'yalc';

async function copyFixtureIntoDir(dir: string, fixtureName: string) {
  const fixturePath = await getFixturePath(__dirname, fixtureName);
  const destPath = path.join(dir, fixtureName);
  await copyDir(fixturePath, destPath);

  return destPath;
}

describe('Link AK integration', () => {
  let tempDirPath: string;
  let atlaskitPath: string;
  let consoleErrorSpy: jest.SpyInstance<Console['error']>;
  let consoleLogSpy: jest.SpyInstance<Console['log']>;

  beforeEach(async () => {
    // Comment out the mockImplementation to read console.logs for debugging
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error');
    tempDirPath = await createTempDir();
    atlaskitPath = await copyFixtureIntoDir(
      tempDirPath,
      'atlaskit-bolt-project',
    );
    // Change the yalc installation path so we don't affect the home dir of devs
    yalc.yalcGlobal.yalcStoreMainDir = path.join(tempDirPath, '.yalc');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should link to an npm project successfully', async () => {
    const repoPath = await copyFixtureIntoDir(
      tempDirPath,
      'product-npm-project',
    );
    const installedPath = path.join(
      repoPath,
      'node_modules',
      '@atlaskit',
      'foo',
      'index.js',
    );

    expect(fs.existsSync(installedPath)).toBe(false);
    await linkAk(repoPath, ['foo'], { cwd: atlaskitPath, nvm: false });
    expect(fs.existsSync(installedPath)).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Yalc:',
      '@atlaskit/foo@0.0.1 published in store.',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Yalc:',
      expect.stringContaining('Package @atlaskit/foo@0.0.1 added'),
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should link to a yarn project successfully', async () => {
    const repoPath = await copyFixtureIntoDir(
      tempDirPath,
      'product-yarn-project',
    );
    const installedPath = path.join(
      repoPath,
      'node_modules',
      '@atlaskit',
      'foo',
      'index.js',
    );

    expect(fs.existsSync(installedPath)).toBe(false);
    await linkAk(repoPath, ['foo'], { cwd: atlaskitPath, nvm: false });
    expect(fs.existsSync(installedPath)).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Yalc:',
      '@atlaskit/foo@0.0.1 published in store.',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Yalc:',
      expect.stringContaining('Package @atlaskit/foo@0.0.1 added'),
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should link to a bolt project successfully', async () => {
    const repoPath = await copyFixtureIntoDir(
      tempDirPath,
      'product-bolt-project',
    );
    const installedPath = path.join(
      repoPath,
      'node_modules',
      '@atlaskit',
      'foo',
      'index.js',
    );

    expect(fs.existsSync(installedPath)).toBe(false);
    await linkAk(repoPath, ['foo'], { cwd: atlaskitPath, nvm: false });
    expect(fs.existsSync(installedPath)).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Yalc:',
      '@atlaskit/foo@0.0.1 published in store.',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Yalc:',
      expect.stringMatching(/@atlaskit\/foo@0.0.1 added to .* purely/),
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
