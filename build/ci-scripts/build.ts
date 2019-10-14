/**
 * The canonical build script for Atlaskit.
 * See CONTRIBUTING.md#building-packages or
 * run `bolt build --help` for more information.
 */
import * as bolt from 'bolt';
import chalk from 'chalk';
import meow from 'meow';
import * as yalc from 'yalc';

import { PackageInfo } from '@atlaskit/build-utils/types';
import { getPackagesInfo } from '@atlaskit/build-utils/tools';
import { prefixConsoleLog } from '@atlaskit/build-utils/logging';
import getGlobPackagesForTools from './get.glob.packages.for.tools';
import createEntryPointsDirectories from './create.entry.points.directories';
import copyVersion from './copy.version';
import validateDists from './validate.dists';
import runCommands, {
  Options as RunOptions,
} from '@atlaskit/build-utils/runCommands';

type DistType = 'cjs' | 'esm' | 'none';
// Its intentional to set the keys here to mandatory
// We use the Partial<T> helper fn where we want optional keys
type Options = {
  cwd: string | undefined;
  distType: DistType | undefined;
  watch: boolean | undefined;
};
type StepArgs = Options & { pkg: PackageInfo | undefined };

function log(...msg: any[]) {
  console.log(chalk.green('Atlaskit build:'), ...msg);
}

async function getPkgGlob(
  tools: string[],
  pkg: PackageInfo | undefined,
  { cwd }: { cwd?: string },
) {
  return pkg ? pkg.relativeDir : await getGlobPackagesForTools(tools, { cwd });
}

function getDistCommands(
  commands: {
    cjs: string;
    esm: string;
  },
  distType: DistType | undefined,
): string[] {
  if (distType === 'none') {
    return [];
  } else if (!distType) {
    return Object.values(commands).filter(Boolean);
  } else {
    return [commands[distType]].filter(Boolean);
  }
}

/**
 * We pattern match watch command output to detect when a recompile has successfully finished.
 * However, since we execute two watch commands if building both types of dists, we have to ensure
 * that we only emit success when both watch commands have finished rather than only one.
 */
function generateWatchSuccessCondition(
  regex: RegExp,
  distType: DistType | undefined,
) {
  const successesRequired = distType ? 1 : 2;
  let successCount = 0;
  return (output: string) => {
    successCount += regex.test(output) ? 1 : 0;
    if (successCount === successesRequired) {
      successCount = 0;
      return true;
    }
    return false;
  };
}

/* Returns watch specific options to the runCommands module that allows us to execute steps after
 * a successful recompile.
 * The steps executed are:
 *   - Validate dists
 *   - Publish package to yalc and push to linked repos
 */
function getWatchCommandOptions(
  buildOptions: {
    cwd: string | undefined;
    distType: DistType | undefined;
    pkg: PackageInfo;
  },
  successRegex: RegExp,
  firstSuccessRegex?: RegExp,
) {
  const { cwd, distType, pkg } = buildOptions;
  const options: Pick<
    RunOptions,
    'watchSuccessCondition' | 'onWatchSuccess' | 'watchFirstSuccessCondition'
  > = {
    watchSuccessCondition: generateWatchSuccessCondition(
      successRegex,
      distType,
    ),
    onWatchSuccess: async () => {
      // Validate dists after recompile to verify they aren't broken
      await runValidateDists({
        cwd,
        distType,
        packageName: pkg.name,
      });
      const restoreConsoleLog = prefixConsoleLog(chalk.blue('Yalc:'));
      // Publish package to yalc with push mode to automatically update the package in linked repos
      await yalc.publishPackage({
        workingDir: pkg.dir,
        push: true,
      });
      restoreConsoleLog();
      log('Recompiled and pushed changes...');
    },
  };

  if (firstSuccessRegex) {
    options.watchFirstSuccessCondition = generateWatchSuccessCondition(
      firstSuccessRegex,
      distType,
    );
  }

  return options;
}

async function generateFlowTypeCommands({
  cwd,
  distType,
  pkg,
  watch,
}: StepArgs) {
  if (pkg && !(pkg.isBabel && pkg.isFlow)) {
    return [];
  }
  const pkgGlob = await getPkgGlob(['babel', 'flow'], pkg, { cwd });
  const watchFlag = watch ? ' -w' : '';
  const commands = {
    cjs: `bolt workspaces exec --only-fs "${pkgGlob}" -- flow-copy-source -i '**/__tests__/**' src dist/cjs${watchFlag}`,
    esm: `bolt workspaces exec --only-fs "${pkgGlob}" -- flow-copy-source -i '**/__tests__/**' src dist/esm${watchFlag}`,
  };

  return getDistCommands(commands, distType);
}

async function babelCommands({ cwd, distType, pkg, watch }: StepArgs) {
  if (pkg && !pkg.isBabel) {
    return [];
  }
  const pkgGlob = await getPkgGlob(['babel'], pkg, { cwd });
  // Watch mode does not output anything on recompile, so we have to use verbose to signal something has happened
  // https://github.com/babel/babel/issues/7926
  const watchFlag = watch ? ' -w --verbose' : '';
  const commands = {
    cjs: `NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "${pkgGlob}" -- babel src -d dist/cjs --root-mode upward${watchFlag}`,
    esm: `NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "${pkgGlob}" -- babel src -d dist/esm --root-mode upward${watchFlag}`,
  };

  return getDistCommands(commands, distType);
}

async function buildJSPackages({ cwd, distType, pkg, watch }: StepArgs) {
  let commandOptions: RunOptions = { cwd };
  if (watch) {
    commandOptions = {
      ...commandOptions,
      ...getWatchCommandOptions(
        // If watch mode is enabled, we have a package
        // TODO: Add TS 3.7 assertion here
        { cwd, distType, pkg: pkg as PackageInfo },
        /babel/,
        /Successfully compiled \d+ files with Babel/,
      ),
    };
  }
  return runCommands(
    [
      ...(await babelCommands({ cwd, pkg, watch, distType })),
      ...(await generateFlowTypeCommands({ cwd, pkg, watch, distType })),
    ],
    commandOptions,
  );
}

async function cliTsCommands({ cwd, distType, pkg, watch }: StepArgs) {
  if (pkg && !pkg.isTypeScriptCLI) {
    return [];
  }

  const pkgGlob = await getPkgGlob(['typescriptcli'], pkg, { cwd });
  const watchFlag = watch ? ' -w --preserveWatchOutput' : '';
  const commands = {
    cjs: `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/cli${watchFlag} && echo Success || true'`,
    esm: '',
  };

  return getDistCommands(commands, distType);
}

async function standardTsCommands({ cwd, distType, pkg, watch }: StepArgs) {
  if (pkg && !pkg.isTypeScript) {
    return [];
  }

  const pkgGlob = await getPkgGlob(['typescript'], pkg, { cwd });
  // preserveWatchOutput prevents watch from clearing console output on every change
  const watchFlag = watch ? ' -w --preserveWatchOutput' : '';
  // The `|| true` at the end of each typescript command was knowingly added in https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/5722/update-tsconfig/diff
  // to suppress multi-entry point related failures, relying on the separate `typecheck` command to catch typecheck errors. Unfortunately, this also
  // suppresses legitimate errors caused by things like dependencies not being built before dependents and means we create inaccurate index.d.ts files.
  // We want to fix this by changing the way we do multi entry points, using typescript project references or another way as error suppression is not a good idea.
  const commands = {
    cjs: `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs${watchFlag} && echo Success || true'`,
    esm: `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext${watchFlag} && echo Success || true'`,
  };

  return getDistCommands(commands, distType);
}

/**
 * Builds typescript packages.
 *
 * Typescript packages in a monorepo need to be built in a topological order, meaning dependencies need to be built before their dependents. Otherwise
 * any dependency types used are treated as `any`.
 * We are leveraging `bolt workspaces exec`'s default topological execution order to achieve this, however there are some existing issues with this:
 *  - The topological order factors in devDependencies when they are not required for building source -https://github.com/boltpkg/bolt/pull/244
 *  - At least one circular dependency exists between packages in the repo, which makes a pure topological sort impossible
 */
async function buildTSPackages({ cwd, distType, pkg, watch }: StepArgs) {
  let commandOptions: RunOptions = { cwd };
  if (watch) {
    commandOptions = {
      ...commandOptions,
      ...getWatchCommandOptions(
        // If watch mode is enabled, we have a package
        // TODO: Add TS 3.7 assertion here
        { cwd, distType, pkg: pkg as PackageInfo },
        /Watching for file changes./,
      ),
    };
  }

  return runCommands(
    [
      ...(await standardTsCommands({ cwd, distType, pkg, watch })),
      ...(await cliTsCommands({ cwd, distType, pkg, watch })),
    ],
    // When building all packages we run the ts commands sequentially  as the `types` field in package.json
    // references the main index.d.ts in the cjs directory. Resulting in cjs needing to be built before esm/cli
    // so that packages can properly utilise the types of their atlaskit dependencies.
    // When building a package individually, we no longer have this requirement as we are only building a single package.
    { sequential: !pkg, ...commandOptions },
  );
}

async function buildExceptionPackages({ cwd, pkg }: StepArgs) {
  await bolt.workspacesRun({
    cwd,
    filterOpts: {
      only: pkg && pkg.name,
    },
    spawnOpts: {
      orderMode: 'parallel',
    },
    script: 'ak-postbuild',
  });
}

async function getPkgInfo(
  packageName: string,
  { cwd }: { cwd?: string } = {},
): Promise<PackageInfo> {
  const allPkgs = await getPackagesInfo(cwd, {
    only: `**/${packageName}`,
  });
  if (allPkgs.length === 0) {
    throw Error(`Cannot find package "${packageName}" in workspaces`);
  }
  if (allPkgs.length > 1) {
    throw Error(`Matched multiple packages, provide an exact package name`);
  }
  return allPkgs[0];
}

async function runValidateDists(opts: {
  cwd: string | undefined;
  distType: DistType | undefined;
  packageName: string | undefined;
}) {
  const { success, packageDistErrors } = await validateDists(opts);
  if (!success) {
    throw new Error(
      `${
        packageDistErrors.length
      } errors detected in package dists:\n * ${packageDistErrors.join('\n * ')}

      If dist has included dependencies and changed the file structure, run yarn build:multi-entry-point-tsconfig and try again.`,
    );
  }
}

function validateArgs(packageName: string | undefined, opts: Options) {
  const { distType, watch } = opts;
  if (!packageName && watch) {
    throw 'Watch mode is only supported for single package builds only.';
  }
  if (
    typeof distType === 'string' &&
    !['esm', 'cjs', 'none'].includes(distType)
  ) {
    throw 'Invalid dist type, must be one of "esm", "cjs" or "none"';
  }
  if (distType === 'none' && watch) {
    throw 'Watch mode with distType "none" does nothing.';
  }
}

export default async function main(
  packageName: string | undefined,
  opts: Partial<Options> & { indent?: number } = {},
) {
  // Ensure we have all option keys set for our internal functions
  const options: Options = {
    cwd: opts.cwd,
    distType: opts.distType,
    watch: opts.watch,
  };
  const { cwd, watch } = options;
  validateArgs(packageName, options);
  if (watch) {
    // Do a full build first to ensure non-compilation build steps have built since they are not rerun
    // in watch mode. Set dist type to none so we don't unnecessarily build dists since that will happen on the
    // initial watch execution.
    log(
      'Running initial build for watch mode to cover non-compilation build steps...',
    );
    await main(packageName, { ...options, distType: 'none', watch: false });
  }

  let fullPackageName;
  let pkg;
  if (packageName) {
    pkg = await getPkgInfo(packageName, { cwd });
    fullPackageName = pkg.name;
  }

  log(`Building ${pkg ? fullPackageName : 'all packages'}...`);
  log('Creating entry point directories...');
  await createEntryPointsDirectories({ cwd, packageName: fullPackageName });
  log('Building JS packages...');
  await buildJSPackages({ pkg, ...options });
  log('Building TS packages...');
  await buildTSPackages({ pkg, ...options });
  log('Running post-build scripts for packages...');
  await buildExceptionPackages({ pkg, ...options });
  log('Copying version.json...');
  await copyVersion(fullPackageName, { cwd });
  log('Validating dists...');
  await runValidateDists({
    cwd,
    distType: options.distType,
    packageName: fullPackageName,
  });

  log('Success');
}

if (require.main === module) {
  process.on('SIGINT', () => {
    // We need our own SIGINT handler since concurrently overrides the default one (and doesn't even throw)
    process.exit(2);
  });
  const cli = meow(
    `
      Usage
        $ bolt build [packageName]

      where packageName is a long form (@atlaskit/my-pkg) or short form (my-pkg) name

      Options
        -d, --distType <cjs|esm|none> Run the build only for a specific distType, cjs or esm, or specify 'none' to not compile a dist type and only run other build steps
        -w, --watch                   Run the build in watch mode. Note this only reruns the compilation step (tsc/babel) and only works with a single package

      Examples
        $ bolt build @atlaskit/button -w
        $ bolt build editor-core --watch --distType cjs
        $ bolt build --d cjs
  `,
    {
      description:
        'Builds [packageName] or all packages if no package name provided',
      flags: {
        distType: {
          alias: 'd',
          type: 'string',
        },
        watch: {
          alias: 'w',
          type: 'boolean',
        },
      },
    },
  );

  main(cli.input[0], {
    cwd: process.cwd(),
    ...cli.flags,
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
