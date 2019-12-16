jest.enableAutomock();
import * as bolt from 'bolt';
import * as yalc from 'yalc';
import runCommands from '@atlaskit/build-utils/runCommands';
import { prefixConsoleLog } from '@atlaskit/build-utils/logging';
import {
  getPackagesInfo,
  TOOL_NAME_TO_FILTERS,
} from '@atlaskit/build-utils/tools';
import createEntryPointsDirectories from '../../create.entry.points.directories';
import copyVersion from '../../copy.version';
import validateDists from '../../validate.dists';

import build from '../../build';

jest.unmock('../../build');
jest.unmock('@atlaskit/build-utils/guards');
jest.mock('../../validate.dists', () =>
  jest.fn(() => Promise.resolve({ success: true })),
);
jest.mock('../../get.glob.packages.for.tools', () =>
  jest.fn((tools: string[]) => `${tools.join('-')}-glob`),
);

describe('Build', () => {
  let consoleErrorSpy: jest.SpyInstance<
    ReturnType<Console['error']>,
    Parameters<Console['error']>
  >;
  let consoleLogSpy: jest.SpyInstance<
    ReturnType<Console['log']>,
    Parameters<Console['log']>
  >;

  beforeAll(() => {
    // Comment out the mockImplementation to read console.logs for debugging
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error');
    // Mock to return a function as the impl returns an unsubscribe fn that is called
    (prefixConsoleLog as any).mockImplementation(() => () => {});
    // Unmock the TOOL_NAME_TO_FILTERS function map so we don't have to change the mock impl
    // for each different package
    Object.keys(TOOL_NAME_TO_FILTERS).forEach(toolName => {
      TOOL_NAME_TO_FILTERS[toolName].mockImplementation(
        jest.requireActual('@atlaskit/build-utils/tools').TOOL_NAME_TO_FILTERS[
          toolName
        ],
      );
    });
  });
  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (getPackagesInfo as any).mockImplementation(() => [
      {
        name: '@atlaskit/editor-core',
        dir: '/Users/dev/atlaskit-mk-2/packages/editor/editor-core',
        relativeDir: 'packages/editor/editor-core',
        runTypeScriptBuild: true,
      },
    ]);
  });
  describe('All packages', () => {
    it('should create entry point directories', async () => {
      expect(createEntryPointsDirectories).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(createEntryPointsDirectories).toHaveBeenCalledTimes(1);
      expect(createEntryPointsDirectories).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        packageName: undefined,
      });
    });
    it('should build all JS packages', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(runCommands).toHaveBeenNthCalledWith(
        1,
        [
          'NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "babel-glob" -- babel src -d dist/cjs --root-mode upward',
          'NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "babel-glob" -- babel src -d dist/esm --root-mode upward',
          'bolt workspaces exec --only-fs "babel-flow-glob" -- flow-copy-source -i \'**/__tests__/**\' src dist/cjs',
          'bolt workspaces exec --only-fs "babel-flow-glob" -- flow-copy-source -i \'**/__tests__/**\' src dist/esm',
        ],
        { cwd: '/Users/dev/atlaskit-mk-2' },
      );
    });
    it('should build all TS packages', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(runCommands).toHaveBeenNthCalledWith(
        2,
        [
          'NODE_ENV=production bolt workspaces exec --no-bail --excludeFromGraph devDependencies --only-fs "typescriptbuild-glob" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs && echo Success\'',
          'NODE_ENV=production bolt workspaces exec --parallel --no-bail --excludeFromGraph devDependencies --only-fs "typescriptbuild-glob" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext && echo Success\'',
        ],
        { cwd: '/Users/dev/atlaskit-mk-2', sequential: true },
      );
    });
    it('should run ak-postbuild scripts for exception packages', async () => {
      expect(bolt.workspacesRun).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(bolt.workspacesRun).toHaveBeenCalledTimes(1);
      expect(bolt.workspacesRun).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        filterOpts: {
          only: undefined,
        },
        spawnOpts: {
          orderMode: 'parallel',
        },
        script: 'ak-postbuild',
      });
    });
    it('should copy all version.json across', async () => {
      expect(copyVersion).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(copyVersion).toHaveBeenCalledTimes(1);
      expect(copyVersion).toHaveBeenCalledWith(undefined);
    });
    it('should validate dists', async () => {
      // Success
      expect(validateDists).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(validateDists).toHaveBeenCalledTimes(1);
      expect(validateDists).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        packageName: undefined,
      });

      // Failure
      (validateDists as any).mockImplementationOnce(() => ({
        success: false,
        packageDistErrors: ['Missing entry point directory for foo'],
      }));
      await expect(
        build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' }),
      ).rejects.toThrow(
        /1 errors detected in package dists:\n.*\* Missing entry point directory for foo\n\n.*If dist has included dependencies and changed the file structure, run yarn build:multi-entry-point-tsconfig and try again./,
      );
    });
  });

  describe('Single package', () => {
    it('should create entry point directory', async () => {
      expect(createEntryPointsDirectories).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(createEntryPointsDirectories).toHaveBeenCalledTimes(1);
      expect(createEntryPointsDirectories).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        packageName: '@atlaskit/editor-core',
      });
    });
    it('should build JS package if it is JS', async () => {
      (getPackagesInfo as any).mockImplementation(() => [
        {
          name: '@atlaskit/navigation-next',
          relativeDir: 'packages/core/navigation-next',
          runBabel: true,
          runFlow: true,
        },
      ]);

      expect(runCommands).not.toHaveBeenCalled();
      await build('navigation-next', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(runCommands).toHaveBeenNthCalledWith(
        1,
        [
          'NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/cjs --root-mode upward',
          'NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/esm --root-mode upward',
          'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/cjs',
          'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/esm',
        ],
        { cwd: '/Users/dev/atlaskit-mk-2' },
      );
      // Does not try to build TS
      expect(runCommands).toHaveBeenNthCalledWith(2, [], expect.any(Object));
    });
    it('should build TS package if it is TS', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(runCommands).toHaveBeenNthCalledWith(
        2,
        [
          'NODE_ENV=production bolt workspaces exec --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs && echo Success || true\'',
          'NODE_ENV=production bolt workspaces exec --parallel --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext && echo Success || true\'',
        ],
        {
          cwd: '/Users/dev/atlaskit-mk-2',
          sequential: false,
        },
      );
      // Does not try to build JS
      expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
    });

    it('should run exception postbuild for package, if one exists', async () => {
      expect(bolt.workspacesRun).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(bolt.workspacesRun).toHaveBeenCalledTimes(1);
      expect(bolt.workspacesRun).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        filterOpts: {
          only: '@atlaskit/editor-core',
        },
        spawnOpts: {
          orderMode: 'parallel',
        },
        script: 'ak-postbuild',
      });
    });
    it('should copy version.json across', async () => {
      expect(copyVersion).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(copyVersion).toHaveBeenCalledTimes(1);
      expect(copyVersion).toHaveBeenCalledWith('@atlaskit/editor-core');
    });
    it('should validate dist', async () => {
      expect(validateDists).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(validateDists).toHaveBeenCalledTimes(1);
      expect(validateDists).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        packageName: '@atlaskit/editor-core',
      });
    });
    it('should ignore TS errors by default', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(runCommands).toHaveBeenNthCalledWith(
        2,
        [
          'NODE_ENV=production bolt workspaces exec --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs && echo Success || true\'',
          'NODE_ENV=production bolt workspaces exec --parallel --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext && echo Success || true\'',
        ],
        {
          cwd: '/Users/dev/atlaskit-mk-2',
          sequential: false,
        },
      );
    });
    it('should not ignore TS errors if strict flag is set', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build('editor-core', {
        cwd: '/Users/dev/atlaskit-mk-2',
        strict: true,
      });
      expect(runCommands).toHaveBeenNthCalledWith(
        2,
        [
          'NODE_ENV=production bolt workspaces exec --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs && echo Success\'',
          'NODE_ENV=production bolt workspaces exec --parallel --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext && echo Success\'',
        ],
        {
          cwd: '/Users/dev/atlaskit-mk-2',
          sequential: false,
        },
      );
    });

    describe('Package names', () => {
      it('should handle both full and shortened package name arg', async () => {
        // Shortened
        expect(getPackagesInfo).not.toHaveBeenCalled();
        await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
        expect(getPackagesInfo).toHaveBeenCalledTimes(1);
        expect(getPackagesInfo).toHaveBeenCalledWith(
          '/Users/dev/atlaskit-mk-2',
          {
            only: '**/editor-core',
          },
        );
        jest.clearAllMocks();

        // Full
        expect(getPackagesInfo).not.toHaveBeenCalled();
        await build('@atlaskit/editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
        });
        expect(getPackagesInfo).toHaveBeenCalledTimes(1);
        expect(getPackagesInfo).toHaveBeenCalledWith(
          '/Users/dev/atlaskit-mk-2',
          {
            only: '**/@atlaskit/editor-core',
          },
        );
      });

      it('should throw if package name not found in repo', async () => {
        (getPackagesInfo as any).mockImplementation(() => []);
        await expect(
          build('foo', { cwd: '/Users/dev/atlaskit-mk-2' }),
        ).rejects.toThrow('Cannot find package "foo" in workspaces');
      });

      it('should throw if package name matches multiple packages', async () => {
        (getPackagesInfo as any).mockImplementation(() => [
          {
            name: '@atlaskit/editor-core',
            relativeDir: 'packages/editor/editor-core',
            runTypeScriptCjs: true,
            runTypeScriptEsm: true,
          },
          {
            name: '@atlaskit/editor-common',
            relativeDir: 'packages/editor/editor-common',
            runTypeScriptCjs: true,
            runTypeScriptEsm: true,
          },
        ]);

        await expect(
          build('editor', { cwd: '/Users/dev/atlaskit-mk-2' }),
        ).rejects.toThrow(
          'Matched multiple packages, provide an exact package name',
        );
      });
    });
  });

  describe('Watch mode', () => {
    it('should run the main build once before commencing watch', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build('editor-core', {
        cwd: '/Users/dev/atlaskit-mk-2',
        watch: true,
      });
      // Entry point called twice since its run before compilation step
      expect(createEntryPointsDirectories).toHaveBeenCalledTimes(2);
      expect(runCommands).toHaveBeenCalledTimes(4);
      // Other steps are only called once since the second compilation is in watch mode which
      // pauses execution. In tests watch mode doesn't hang so we just verify they've been called
      expect(bolt.workspacesRun).toHaveBeenCalled();
      expect(copyVersion).toHaveBeenCalled();
      expect(validateDists).toHaveBeenCalled();
    });
    it('should not compile JS/TS in the initial build before commencing watch', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build('editor-core', {
        cwd: '/Users/dev/atlaskit-mk-2',
        watch: true,
      });
      expect(runCommands).toHaveBeenCalledTimes(4);
      expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
      expect(runCommands).toHaveBeenNthCalledWith(2, [], expect.any(Object));
      expect(validateDists).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        distType: 'none',
        packageName: '@atlaskit/editor-core',
      });
    });
    describe('JS package', () => {
      beforeEach(() => {
        (getPackagesInfo as any).mockImplementation(() => [
          {
            name: '@atlaskit/navigation-next',
            dir: '/Users/dev/atlaskit-mk-2/packages/core/navigation-next',
            relativeDir: 'packages/core/navigation-next',
            runBabel: true,
            runFlow: true,
          },
        ]);
      });

      it('should run the JS compilation in watch mode for a JS package', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build('navigation-next', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });
        // Does not build JS on initial build
        expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
        // Does not try to build TS
        expect(runCommands).toHaveBeenNthCalledWith(2, [], expect.any(Object));

        expect(runCommands).toHaveBeenNthCalledWith(
          3,
          [
            'NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/cjs --root-mode upward -w --verbose',
            'NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/esm --root-mode upward -w --verbose',
            'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/cjs -w',
            'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/esm -w',
          ],
          {
            cwd: '/Users/dev/atlaskit-mk-2',
            onWatchSuccess: expect.any(Function),
            watchFirstSuccessCondition: expect.any(Function),
            watchSuccessCondition: expect.any(Function),
          },
        );
        // Does not try to build TS
        expect(runCommands).toHaveBeenNthCalledWith(4, [], expect.any(Object));
      });

      it('should validate dists on first successful recompile of a JS package', async () => {
        await build('navigation-next', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });

        // Third run of runCommands - first 2 are the initial build, 3rd is JS in watch
        const runCommandOptions = (runCommands as any).mock.calls[2][1];

        expect(validateDists).toHaveBeenCalled();
        expect(validateDists).toHaveBeenCalledWith({
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'none',
          packageName: '@atlaskit/navigation-next',
        });

        jest.clearAllMocks();
        runCommandOptions.onWatchSuccess({ firstSuccess: true });
        expect(validateDists).toHaveBeenCalledTimes(1);
        expect(validateDists).toHaveBeenLastCalledWith({
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: undefined,
          packageName: '@atlaskit/navigation-next',
        });
      });

      it('should not validate dists on subsequent successful recompiles of a JS package', async () => {
        await build('navigation-next', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });

        // Third run of runCommands - first 2 are the initial build, 3rd is JS in watch
        const runCommandOptions = (runCommands as any).mock.calls[2][1];

        expect(validateDists).toHaveBeenCalled();
        expect(validateDists).toHaveBeenCalledWith({
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'none',
          packageName: '@atlaskit/navigation-next',
        });

        jest.clearAllMocks();
        runCommandOptions.onWatchSuccess({ firstSuccess: false });
        expect(validateDists).not.toHaveBeenCalled();
      });

      it('should trigger `yalc push` on successful recompile of a JS package', async () => {
        await build('navigation-next', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });

        expect(runCommands).toHaveBeenCalled();

        // Third run of runCommands - first 2 are the initial build, 3rd is JS in watch
        const runCommandOptions = (runCommands as any).mock.calls[2][1];

        // Test onWatchSuccess
        expect(yalc.publishPackage).not.toHaveBeenCalled();
        await runCommandOptions.onWatchSuccess({ firstSuccess: false });
        expect(yalc.publishPackage).toHaveBeenCalledTimes(1);
        expect(yalc.publishPackage).toHaveBeenCalledWith({
          workingDir: '/Users/dev/atlaskit-mk-2/packages/core/navigation-next',
          changed: true,
          push: true,
        });
      });
      it('should detect successful JS initial watch compile after babel emits success message twice', async () => {
        await build('navigation-next', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });

        expect(runCommands).toHaveBeenCalled();

        // Third run of runCommands - first 2 are the initial build, 3rd is JS in watch
        const runCommandOptions = (runCommands as any).mock.calls[2][1];

        // Running once means only one dist type has completed
        expect(
          runCommandOptions.watchFirstSuccessCondition(
            'Successfully compiled 1 files with Babel',
          ),
        ).toBe(false);
        // Twice means both dist types have completed
        expect(
          runCommandOptions.watchFirstSuccessCondition(
            'Successfully compiled 1 files with Babel',
          ),
        ).toBe(true);

        // Different type of message should never return success
        expect(
          runCommandOptions.watchFirstSuccessCondition(
            'babel src -d dist/cjs -w --verbose src/foo.js -> src/bar.js',
          ),
        ).toBe(false);
        expect(
          runCommandOptions.watchFirstSuccessCondition(
            'babel src -d dist/cjs -w --verbose src/foo.js -> src/bar.js',
          ),
        ).toBe(false);
      });
      it('should detect successful JS subsequent watch recompiles after babel emits transpilation message twice', async () => {
        await build('navigation-next', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });

        expect(runCommands).toHaveBeenCalled();

        // Third run of runCommands - first 2 are the initial build, 3rd is JS in watch
        const runCommandOptions = (runCommands as any).mock.calls[2][1];

        // Running once means only one dist has recompiled
        expect(
          runCommandOptions.watchSuccessCondition(
            'babel src -d dist/cjs -w --verbose src/foo.js -> src/bar.js',
          ),
        ).toBe(false);
        // Running twice means both have recompiled
        expect(
          runCommandOptions.watchSuccessCondition(
            'babel src -d dist/cjs -w --verbose src/foo.js -> src/bar.js',
          ),
        ).toBe(true);

        // Running again should revert back to false since its start of another recompile
        expect(
          runCommandOptions.watchSuccessCondition(
            'babel src -d dist/cjs -w --verbose src/foo.js -> src/bar.js',
          ),
        ).toBe(false);
        expect(
          runCommandOptions.watchSuccessCondition(
            'babel src -d dist/cjs -w --verbose src/foo.js -> src/bar.js',
          ),
        ).toBe(true);

        // Invalid messages should never be successful
        expect(runCommandOptions.watchSuccessCondition('error')).toBe(false);
        expect(runCommandOptions.watchSuccessCondition('error')).toBe(false);
      });
      it('should detect successful JS initial watch compile after only one success message when a single dist type is built', async () => {
        await build('navigation-next', {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'cjs',
          watch: true,
        });

        expect(runCommands).toHaveBeenCalled();

        // Third run of runCommands - first 2 are the initial build, 3rd is JS in watch
        const runCommandOptions = (runCommands as any).mock.calls[2][1];

        // Should detect success straight away
        expect(
          runCommandOptions.watchFirstSuccessCondition(
            'Successfully compiled 1 files with Babel',
          ),
        ).toBe(true);

        expect(
          runCommandOptions.watchFirstSuccessCondition('non-success message'),
        ).toBe(false);
      });
      it('should detect successful JS subsequent watch recompile after only one success message when a single dist type is built', async () => {
        await build('navigation-next', {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'cjs',
          watch: true,
        });

        expect(runCommands).toHaveBeenCalled();

        // Third run of runCommands - first 2 are the initial build, 3rd is JS in watch
        const runCommandOptions = (runCommands as any).mock.calls[2][1];

        // Should detect success straight away
        expect(
          runCommandOptions.watchSuccessCondition(
            'babel src -d dist/cjs -w --verbose src/foo.js -> src/bar.js',
          ),
        ).toBe(true);

        // Running again should be detected as success as well
        expect(
          runCommandOptions.watchSuccessCondition(
            'babel src -d dist/cjs -w --verbose src/foo.js -> src/bar.js',
          ),
        ).toBe(true);

        expect(
          runCommandOptions.watchFirstSuccessCondition('non-success message'),
        ).toBe(false);
      });
    });
    describe('TS package', () => {
      it('should run the TS compilation in watch mode for a TS package', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });
        // Does not build anything on initial build
        expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(2, [], expect.any(Object));

        // Watch mode
        expect(runCommands).toHaveBeenNthCalledWith(3, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(
          4,
          [
            'NODE_ENV=production bolt workspaces exec --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs -w --preserveWatchOutput && echo Success || true\'',
            'NODE_ENV=production bolt workspaces exec --parallel --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext -w --preserveWatchOutput && echo Success || true\'',
          ],
          {
            cwd: '/Users/dev/atlaskit-mk-2',
            sequential: false,
            onWatchSuccess: expect.any(Function),
            watchSuccessCondition: expect.any(Function),
          },
        );
      });
      it('should validate dists on first successful recompile of a TS package', async () => {
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });

        // Third run of runCommands - first 2 are the initial build, 4th is TS in watch
        const runCommandOptions = (runCommands as any).mock.calls[3][1];

        expect(validateDists).toHaveBeenCalled();
        expect(validateDists).toHaveBeenCalledWith({
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'none',
          packageName: '@atlaskit/editor-core',
        });

        jest.clearAllMocks();
        runCommandOptions.onWatchSuccess({ firstSuccess: true });
        expect(validateDists).toHaveBeenCalledTimes(1);
        expect(validateDists).toHaveBeenLastCalledWith({
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: undefined,
          packageName: '@atlaskit/editor-core',
        });
      });
      it('should NOT validate dists on subsequent successful recompiles of a TS package', async () => {
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });

        // Third run of runCommands - first 2 are the initial build, 4th is TS in watch
        const runCommandOptions = (runCommands as any).mock.calls[3][1];

        expect(validateDists).toHaveBeenCalled();
        expect(validateDists).toHaveBeenCalledWith({
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'none',
          packageName: '@atlaskit/editor-core',
        });

        jest.clearAllMocks();
        runCommandOptions.onWatchSuccess({ firstSuccess: false });
        expect(validateDists).not.toHaveBeenCalled();
      });
      it('should trigger `yalc push` on successful recompile of a TS package', async () => {
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });

        expect(runCommands).toHaveBeenCalled();

        // Fourth run of runCommands - first 2 are the initial build, 4th is TS watch
        const runCommandOptions = (runCommands as any).mock.calls[3][1];

        expect(yalc.publishPackage).not.toHaveBeenCalled();
        await runCommandOptions.onWatchSuccess({ firstSuccess: false });
        expect(yalc.publishPackage).toHaveBeenCalledTimes(1);
        expect(yalc.publishPackage).toHaveBeenCalledWith({
          workingDir: '/Users/dev/atlaskit-mk-2/packages/editor/editor-core',
          changed: true,
          push: true,
        });
      });
      it('should detect successful TS watch recompiles after tsc emits completion message twice', async () => {
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          watch: true,
        });

        expect(runCommands).toHaveBeenCalled();

        // Fourth run of runCommands - first 2 are the initial build, 4th is TS watch
        const runCommandOptions = (runCommands as any).mock.calls[3][1];

        // First run should be false as only one dist type has completed
        expect(
          runCommandOptions.watchSuccessCondition('Watching for file changes.'),
        ).toBe(false);
        // Second should now return true
        expect(
          runCommandOptions.watchSuccessCondition('Watching for file changes.'),
        ).toBe(true);

        // After success, recompile resets and now returns false again for first dist
        expect(
          runCommandOptions.watchSuccessCondition('Watching for file changes.'),
        ).toBe(false);
        // Second should now return true
        expect(
          runCommandOptions.watchSuccessCondition('Watching for file changes.'),
        ).toBe(true);

        // Bad patterns should never trigger success
        expect(
          runCommandOptions.watchSuccessCondition(
            'Starting compilation in watch mode',
          ),
        ).toBe(false);
        expect(
          runCommandOptions.watchSuccessCondition(
            'Starting compilation in watch mode',
          ),
        ).toBe(false);
      });
      it('should detect successful TS watch recompiles after tsc emits only one completion message when a single dist type is built', async () => {
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'cjs',
          watch: true,
        });

        expect(runCommands).toHaveBeenCalled();

        // Fourth run of runCommands - first 2 are the initial build, 4th is TS watch
        const runCommandOptions = (runCommands as any).mock.calls[3][1];

        // First run should emit success now
        expect(
          runCommandOptions.watchSuccessCondition('Watching for file changes.'),
        ).toBe(true);
        // Second should also emit success for recompiles
        expect(
          runCommandOptions.watchSuccessCondition('Watching for file changes.'),
        ).toBe(true);

        // Bad patterns should never trigger success
        expect(
          runCommandOptions.watchSuccessCondition(
            'Starting compilation in watch mode',
          ),
        ).toBe(false);
        expect(
          runCommandOptions.watchSuccessCondition(
            'Starting compilation in watch mode',
          ),
        ).toBe(false);
      });
    });
  });

  describe('distType option', () => {
    describe('All packages', () => {
      it('should only build cjs dist types when "cjs" distType option is passed', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build(undefined, {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'cjs',
        });
        expect(runCommands).toHaveBeenCalledTimes(2);
        expect(runCommands).toHaveBeenNthCalledWith(
          1,
          [
            'NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "babel-glob" -- babel src -d dist/cjs --root-mode upward',
            'bolt workspaces exec --only-fs "babel-flow-glob" -- flow-copy-source -i \'**/__tests__/**\' src dist/cjs',
          ],
          { cwd: '/Users/dev/atlaskit-mk-2' },
        );
        expect(runCommands).toHaveBeenNthCalledWith(
          2,
          [
            'NODE_ENV=production bolt workspaces exec --no-bail --excludeFromGraph devDependencies --only-fs "typescriptbuild-glob" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs && echo Success\'',
          ],
          {
            cwd: '/Users/dev/atlaskit-mk-2',
            sequential: true,
          },
        );
      });

      it('should only build esm dist types when "esm" distType option is passed', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build(undefined, {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'esm',
        });
        expect(runCommands).toHaveBeenCalledTimes(2);
        expect(runCommands).toHaveBeenNthCalledWith(
          1,
          [
            'NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "babel-glob" -- babel src -d dist/esm --root-mode upward',
            'bolt workspaces exec --only-fs "babel-flow-glob" -- flow-copy-source -i \'**/__tests__/**\' src dist/esm',
          ],
          { cwd: '/Users/dev/atlaskit-mk-2' },
        );
        expect(runCommands).toHaveBeenNthCalledWith(
          2,
          [
            'NODE_ENV=production bolt workspaces exec --parallel --no-bail --excludeFromGraph devDependencies --only-fs "typescriptbuild-glob" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext && echo Success\'',
          ],
          {
            cwd: '/Users/dev/atlaskit-mk-2',
            sequential: true,
          },
        );
      });

      it('should not build any dist types when "none" distType option is passed', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build(undefined, {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'none',
        });
        expect(runCommands).toHaveBeenCalledTimes(2);
        expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(2, [], expect.any(Object));
      });
      it('should only validate dists for the specific distType', async () => {
        expect(validateDists).not.toHaveBeenCalled();
        await build(undefined, {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'cjs',
        });
        expect(validateDists).toHaveBeenCalledTimes(1);
        expect(validateDists).toHaveBeenCalledWith({
          cwd: '/Users/dev/atlaskit-mk-2',
          packageName: undefined,
          distType: 'cjs',
        });
      });
    });

    describe('Single package', () => {
      it('should only build cjs dist types when "cjs" distType option is passed', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'cjs',
        });
        expect(runCommands).toHaveBeenCalledTimes(2);
        expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(
          2,
          [
            'NODE_ENV=production bolt workspaces exec --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs && echo Success || true\'',
          ],
          {
            cwd: '/Users/dev/atlaskit-mk-2',
            sequential: false,
          },
        );
      });

      it('should only build esm dist types when "esm" distType option is passed', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'esm',
        });
        expect(runCommands).toHaveBeenCalledTimes(2);
        expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(
          2,
          [
            'NODE_ENV=production bolt workspaces exec --parallel --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext && echo Success || true\'',
          ],
          {
            cwd: '/Users/dev/atlaskit-mk-2',
            sequential: false,
          },
        );
      });

      it('should not build any dist types when "none" distType option is passed', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'none',
        });
        expect(runCommands).toHaveBeenCalledTimes(2);
        expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(2, [], expect.any(Object));
      });
    });

    describe('Watch mode', () => {
      it('should only build cjs dist types when "cjs" distType option is passed', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'cjs',
          watch: true,
        });
        expect(runCommands).toHaveBeenCalledTimes(4);

        // Initial build
        expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(2, [], expect.any(Object));

        // Watch
        expect(runCommands).toHaveBeenNthCalledWith(3, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(
          4,
          [
            'NODE_ENV=production bolt workspaces exec --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs -w --preserveWatchOutput && echo Success || true\'',
          ],
          {
            cwd: '/Users/dev/atlaskit-mk-2',
            sequential: false,
            onWatchSuccess: expect.any(Function),
            watchSuccessCondition: expect.any(Function),
          },
        );
      });

      it('should only build esm dist types when "esm" distType option is passed', async () => {
        expect(runCommands).not.toHaveBeenCalled();
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'esm',
          watch: true,
        });
        expect(runCommands).toHaveBeenCalledTimes(4);

        // Initial Build
        expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(2, [], expect.any(Object));

        // Watch
        expect(runCommands).toHaveBeenNthCalledWith(3, [], expect.any(Object));
        expect(runCommands).toHaveBeenNthCalledWith(
          4,
          [
            'NODE_ENV=production bolt workspaces exec --parallel --no-bail --excludeFromGraph devDependencies --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext -w --preserveWatchOutput && echo Success || true\'',
          ],
          {
            cwd: '/Users/dev/atlaskit-mk-2',
            sequential: false,
            onWatchSuccess: expect.any(Function),
            watchSuccessCondition: expect.any(Function),
          },
        );
      });

      it('should only validate a specific dist type when distType option is passed', async () => {
        await build('editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'cjs',
          watch: true,
        });

        // Third run of runCommands - first 2 are the initial build, 4th is TS in watch
        const runCommandOptions = (runCommands as any).mock.calls[3][1];

        expect(validateDists).toHaveBeenCalled();
        expect(validateDists).toHaveBeenCalledWith({
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'none',
          packageName: '@atlaskit/editor-core',
        });

        jest.clearAllMocks();
        runCommandOptions.onWatchSuccess({ firstSuccess: true });
        expect(validateDists).toHaveBeenCalledTimes(1);
        expect(validateDists).toHaveBeenLastCalledWith({
          cwd: '/Users/dev/atlaskit-mk-2',
          distType: 'cjs',
          packageName: '@atlaskit/editor-core',
        });
      });
    });
  });

  describe('Args Validation', () => {
    it('should throw if watch mode is used without a package', async () => {
      await expect(build(undefined, { watch: true })).rejects.toBe(
        'Watch mode is only supported for single package builds only.',
      );
    });
    it('should throw if an invalid dist type is passed', async () => {
      // @ts-ignore
      await expect(build('editor-core', { distType: 'esnext' })).rejects.toBe(
        'Invalid dist type, must be one of "esm", "cjs" or "none"',
      );
    });
    it('should throw if dist type "none" is used with watch mode', async () => {
      await expect(
        build('editor-core', { distType: 'none', watch: true }),
      ).rejects.toBe('Watch mode with distType "none" does nothing.');
    });
  });
});
