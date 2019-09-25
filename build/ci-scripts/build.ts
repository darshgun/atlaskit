/**
 * The canonical build script for Atlaskit.
 * See CONTRIBUTING.md#building-packages or
 * run `bolt w @atlaskit/ci-scripts build --help` for more information.
 */
import * as bolt from 'bolt';
import concurrently from 'concurrently';
import meow from 'meow';

import { PackageInfo } from '@atlaskit/build-utils/types';
import { getPackagesInfo } from '@atlaskit/build-utils/tools';
import getGlobPackagesForTools from './get.glob.packages.for.tools';
import createEntryPointsDirectories from './create.entry.points.directories';
import copyVersion from './copy.version';
import validateDists from './validate.dists';

type WatchFlag = boolean | 'cjs' | 'esm' | undefined;
type StepArgs = { cwd: string | undefined; pkg: PackageInfo | undefined };
type StepArgsWithWatch = StepArgs & {
  watch: WatchFlag;
};

async function runCommands(
  commands: string[],
  opts: { sequential?: boolean; [concurrentlyOption: string]: any } = {},
): Promise<any> {
  const defaultOpts = {
    // Will kill other processes when one fails
    killOthers: ['failure'],
    // Opt out of default logging prefix of index/name - bolt does most of this for us already
    prefix: 'none',
    // Raw mode will strictly output only raw output, rather than extra stuff
    // that concurrently outputs. We enable the extra output for now.
    raw: false,
  };
  if (commands.length === 0) {
    return;
  }
  if (commands.length === 1 || !opts.sequential) {
    return concurrently(commands, { ...defaultOpts, ...opts }).catch(() => {
      // Hide internal concurrently stack trace as it does not provide anything useful
      // See https://github.com/kimmobrunfeldt/concurrently/issues/181
      throw Error('Command failed');
    });
  } else {
    let result;
    for (const command of commands) {
      result = await runCommands([command]);
    }
    return result;
  }
}

async function getPkgGlob(
  tools: string[],
  pkg: PackageInfo | undefined,
  { cwd }: { cwd?: string },
) {
  return pkg ? pkg.relativeDir : await getGlobPackagesForTools(tools, { cwd });
}

async function generateFlowTypeCommands({
  cwd,
  pkg,
  watch,
}: StepArgsWithWatch) {
  if (pkg && !(pkg.isBabel && pkg.isFlow)) {
    return [];
  }
  const pkgGlob = await getPkgGlob(['babel', 'flow'], pkg, { cwd });
  const watchFlag = watch ? ' -w' : '';
  const commands = {
    cjs: `bolt workspaces exec --only-fs "${pkgGlob}" -- flow-copy-source -i '**/__tests__/**' src dist/cjs${watchFlag}`,
    esm: `bolt workspaces exec --only-fs "${pkgGlob}" -- flow-copy-source -i '**/__tests__/**' src dist/esm${watchFlag}`,
  };

  return typeof watch === 'string'
    ? [commands[watch]]
    : Object.values(commands);
}

async function babelCommands({ cwd, pkg, watch }: StepArgsWithWatch) {
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

  return typeof watch === 'string'
    ? [commands[watch]]
    : Object.values(commands);
}

async function buildJSPackages({ cwd, pkg, watch }: StepArgsWithWatch) {
  return runCommands([
    ...(await babelCommands({ cwd, pkg, watch })),
    ...(await generateFlowTypeCommands({ cwd, pkg, watch })),
  ]);
}

async function cliTsCommands({ cwd, pkg, watch }: StepArgsWithWatch) {
  if (pkg && !pkg.isTypeScriptCLI) {
    return [];
  }

  const pkgGlob = await getPkgGlob(['typescriptcli'], pkg, { cwd });
  const watchFlag = watch ? ' -w --preserveWatchOutput' : '';
  return [
    `NODE_ENV=production bolt workspaces exec --only-fs "${pkgGlob}" -- bash -c 'tsc --project ./build/cli${watchFlag} && echo Success || true'`,
  ];
}

async function standardTsCommands({ cwd, pkg, watch }: StepArgsWithWatch) {
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
  return typeof watch === 'string'
    ? [commands[watch]]
    : Object.values(commands);
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
async function buildTSPackages({ cwd, pkg, watch }: StepArgsWithWatch) {
  return runCommands(
    [
      ...(await standardTsCommands({ cwd, pkg, watch })),
      ...(await cliTsCommands({ cwd, pkg, watch })),
    ],
    // When building all packages we run the ts commands sequentially  as the `types` field in package.json
    // references the main index.d.ts in the cjs directory. Resulting in cjs needing to be built before esm/cli
    // so that packages can properly utilise the types of their atlaskit dependencies.
    // When building a package individually, we no longer have this requirement as we are only building a single package.
    { sequential: !pkg },
  );
}

async function buildExceptionPackages({ cwd, pkg }: StepArgs) {
  await bolt.workspacesRun({
    cwd,
    filterOpts: {
      only: pkg && pkg.name,
    },
    spawnOpts: {
      parallel: true,
    },
    script: 'ak-postbuild',
  });
}

async function getPkgInfo(packageName: string): Promise<PackageInfo> {
  const allPkgs = await getPackagesInfo(packageName, {
    only: packageName,
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

async function main(
  packageName: string | undefined,
  opts: { cwd?: string; watch?: WatchFlag } = {},
) {
  const { cwd, watch } = opts;
  if (!packageName && watch) {
    throw 'Watch mode is only supported for single package builds only.';
  }
  if (watch) {
    if (typeof watch === 'string' && !['esm', 'cjs'].includes(watch)) {
      throw 'Watch must be boolean or one of "esm", "cjs"';
    }
    // Do a full build first to ensure non-compilation build steps have built since they are not rerun
    // in watch mode
    console.log(
      'Running initial build for watch mode to cover non-compilation build steps...',
    );
    await main(packageName, { ...opts, watch: false });
  }

  console.log(`Building ${packageName ? packageName : 'all packages'}...`);
  let pkg;
  if (packageName) {
    pkg = await getPkgInfo(packageName);
  }
  console.log('Creating entry point directories...');
  await createEntryPointsDirectories({ cwd, packageName });
  console.log('Building JS packages...');
  await buildJSPackages({ cwd, pkg, watch });
  console.log('Building TS packages...');
  await buildTSPackages({ cwd, pkg, watch });
  console.log('Running post-build scripts for packages...');
  await buildExceptionPackages({ cwd, pkg });
  console.log('Copying version.json...');
  await copyVersion(packageName);
  console.log('Validating dists...');
  await runValidateDists({ cwd, packageName });

  console.log('Success');
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

      Options
        --watch [esm/cjs]               Run the build in watch mode. Note this only reruns the compilation step (tsc/babel) and only works with a single package

      Examples
        $ bolt build @atlaskit/button --watch
        $ bolt build @atlaskit/editor-core --watch esm
  `,
    {
      description:
        'Builds [packageName] or all packages if no package name provided',
      flags: {
        watch: {
          alias: 'w',
          type: 'string',
        },
      },
    },
  );

  main(cli.input[0], {
    cwd: process.cwd(),
    ...{
      ...cli.flags,
      // Support both string/boolean type
      watch: cli.flags.watch === '' ? true : cli.flags.watch,
    },
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = main;
