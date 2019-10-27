import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as yalc from 'yalc';

import build from '../../build';

const exec = util.promisify(child_process.exec);

// Kill any child processes spawned by the build that might be hanging around still
// This will happen when running tests for watch mode
// Unfortunately signals like SIGINT/SIGTERM can't be captured appropriately in jest so
// zombie processes may still stick around.
// https://github.com/facebook/jest/pull/8206 may help with this once released
async function cleanWatchProcesses() {
  await exec(
    `pkill -TERM -P ${process.pid} || echo 'No child processes running'`,
  );
}

describe('Build - Functional', () => {
  let tempDirPath: string;
  let consoleErrorSpy: jest.SpyInstance<
    ReturnType<Console['error']>,
    Parameters<Console['error']>
  >;
  let consoleLogSpy: jest.SpyInstance<
    ReturnType<Console['log']>,
    Parameters<Console['log']>
  >;
  let fooDistPath: string;
  let barDistPath: string;

  function testWatch(
    pkg: string,
    srcFile: string,
    compiledFile: string,
    done: Function,
    distType?: string,
  ) {
    let recompileCount = 0;
    const distPath = path.join(tempDirPath, 'packages', 'a-team', pkg, 'dist');
    expect(fs.existsSync(distPath)).toBe(false);
    consoleLogSpy.mockImplementation((...args) => {
      if (args.includes('Recompiled and pushed changes...')) {
        if (recompileCount === 0) {
          // expect package to be built
          expect(fs.existsSync(distPath)).toBe(true);
          recompileCount++;
          setTimeout(() => {
            // touch a file to trigger recomp
            fs.writeFileSync(
              path.join(tempDirPath, 'packages', 'a-team', pkg, 'src', srcFile),
              '',
            );
          }, 500);
        } else if (recompileCount === 1) {
          // expect package to be recompiled
          expect(fs.existsSync(path.join(distPath, 'cjs', compiledFile))).toBe(
            !distType || distType === 'cjs',
          );
          expect(fs.existsSync(path.join(distPath, 'esm', compiledFile))).toBe(
            !distType || distType === 'esm',
          );
          cleanWatchProcesses().finally(() => {
            // afterEach is called before we call done...???
            done();
          });
        }
      }
    });
  }

  beforeAll(() => {
    // Comment out the mockImplementation to read console.logs for debugging
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error');
  });
  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  beforeEach(async () => {
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
    tempDirPath = await copyFixtureIntoTempDir(
      __dirname,
      'atlaskit-bolt-project',
    );
    fooDistPath = path.join(tempDirPath, 'packages', 'a-team', 'foo', 'dist');
    barDistPath = path.join(tempDirPath, 'packages', 'a-team', 'bar', 'dist');
    // Change the yalc installation path so we don't affect the home dir of devs
    yalc.yalcGlobal.yalcStoreMainDir = path.join(tempDirPath, '.yalc');
  });

  it('should build all packages by default', async () => {
    await build(undefined, { cwd: tempDirPath });
    expect(fs.existsSync(path.join(barDistPath, 'cjs'))).toBe(true);
    expect(fs.existsSync(path.join(barDistPath, 'esm'))).toBe(true);
    expect(fs.existsSync(path.join(fooDistPath, 'cjs'))).toBe(true);
    expect(fs.existsSync(path.join(fooDistPath, 'esm'))).toBe(true);
  });

  it('should build a single package', async () => {
    await build('foo', { cwd: tempDirPath });
    expect(fs.existsSync(path.join(fooDistPath, 'cjs'))).toBe(true);
    expect(fs.existsSync(path.join(fooDistPath, 'esm'))).toBe(true);
    expect(fs.existsSync(barDistPath)).toBe(false);
  });

  it('should build all packages with dist type', async () => {
    await build(undefined, { cwd: tempDirPath, distType: 'cjs' });
    expect(fs.existsSync(path.join(barDistPath, 'cjs'))).toBe(true);
    expect(fs.existsSync(path.join(barDistPath, 'esm'))).toBe(false);
    expect(fs.existsSync(path.join(fooDistPath, 'cjs'))).toBe(true);
    expect(fs.existsSync(path.join(fooDistPath, 'esm'))).toBe(false);
  });

  it('should build a single package with dist type', async () => {
    await build('foo', { cwd: tempDirPath, distType: 'cjs' });
    expect(fs.existsSync(barDistPath)).toBe(false);
    expect(fs.existsSync(path.join(fooDistPath, 'cjs'))).toBe(true);
    expect(fs.existsSync(path.join(fooDistPath, 'esm'))).toBe(false);
  });

  // Skipping this suite since it spawns too many zombie processes that we can't eliminate
  // in all cases
  describe.skip('Watch mode', () => {
    afterEach(async () => {
      await cleanWatchProcesses();
    });
    afterAll(async () => {
      await cleanWatchProcesses();
    });
    it('should build and recompile JS packages', done => {
      testWatch('foo', 'new.js', 'new.js', done);
      build('foo', { cwd: tempDirPath, watch: true }).catch(e => {
        throw e;
      });
    }, 30000);

    it('should build and recompile TS packages', done => {
      testWatch('bar', 'new.ts', 'new.js', done);
      build('bar', { cwd: tempDirPath, watch: true }).catch(e => {
        throw e;
      });
    }, 30000);

    it('should build and recompile JS packages with a single dist type', done => {
      testWatch('foo', 'new.js', 'new.js', done, 'esm');
      build('foo', { cwd: tempDirPath, distType: 'esm', watch: true }).catch(
        e => {
          throw e;
        },
      );
    }, 30000);

    it('should build and recompile TS packages with a single dist type', done => {
      testWatch('bar', 'new.ts', 'new.js', done, 'esm');
      build('bar', { cwd: tempDirPath, distType: 'esm', watch: true }).catch(
        e => {
          throw e;
        },
      );
    }, 30000);
  });
});
