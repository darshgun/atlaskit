// @flow
import fs from 'fs';
import path from 'path';

import { createEntryPointsDirWithPkgJson } from '../../createEntryPointsUtils';

const bolt = require('bolt');

jest.spyOn(global.console, 'log').mockImplementation(() => {});

function deleteDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) return;
  const entryPaths = fs.readdirSync(directoryPath);
  entryPaths.forEach(entryPath => {
    const resolvedPath = path.resolve(directoryPath, entryPath);
    if (fs.lstatSync(resolvedPath).isDirectory()) {
      deleteDirectory(resolvedPath);
    } else {
      fs.unlinkSync(resolvedPath);
    }
  });
  fs.rmdirSync(directoryPath);
}

const dirsToRemove = [];
describe('Entrypoints', () => {
  beforeEach(() => {
    dirsToRemove.forEach(file => deleteDirectory(file));
  });
  afterEach(() => {
    dirsToRemove.forEach(file => deleteDirectory(file));
    jest.resetAllMocks();
  });
  test('createEntryPointsDirWithPkgJson is generating folders', async () => {
    await createEntryPointsDirWithPkgJson();
    const packages = await bolt.getWorkspaces();
    const pkgContents = packages
      .filter(pkg => pkg.dir.includes('/packages'))
      .map(pkg => {
        return {
          name: pkg.name,
          pkgDirPath: pkg.dir,
          files: fs
            .readdirSync(path.join(pkg.dir, 'src'))
            .filter(
              file =>
                file.includes('.') &&
                !file.includes('index') &&
                path.parse(file).name &&
                !file.includes('.d.ts') &&
                !file.includes('version.json'),
            ),
        };
      });
    for (const pkg of pkgContents) {
      for (const pkgFile of pkg.files) {
        const file = path.parse(pkgFile).name;
        const entryPointDirName = path.join(pkg.pkgDirPath, file);
        console.log(entryPointDirName);
        dirsToRemove.push(entryPointDirName);
        try {
          expect(fs.existsSync(entryPointDirName)).toBeTruthy();
          const dirContent = fs.readdirSync(entryPointDirName);
          expect(dirContent).toContain('package.json');
        } catch (e) {
          throw new Error(
            `${entryPointDirName} folder should exist and should contain a package.json : ${e}`,
          );
        }
      }
    }
  });
});
