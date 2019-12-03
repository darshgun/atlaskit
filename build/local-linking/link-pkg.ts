/**
 * @file link-pkg.ts
 *
 * Links packages to another repo via yalc
 */
import * as bolt from 'bolt';
import chalk from 'chalk';
import fse from 'fs-extra';
import meow from 'meow';
import path from 'path';
import * as yalc from 'yalc';
import runCommands from '@atlaskit/build-utils/runCommands';
import { prefixConsoleLog } from '@atlaskit/build-utils/logging';
import { ValidationError } from '@atlaskit/build-utils/errors';
import { isDefined } from './utils';

export type Options = {
  cwd?: string;
  entry?: string;
  nvm?: boolean;
};

const defaultOptions = {
  nvm: true,
};
const scopeRegex = /@[^\/]+\//;

async function detectRepoType(
  repoPath: string,
): Promise<'yarn' | 'bolt' | 'npm'> {
  let pkgJson;
  try {
    pkgJson = await fse.readJson(path.join(repoPath, 'package.json'));
  } catch (e) {
    console.error(chalk.red('Could not detect repo type'));
    throw e;
  }
  const yarnLockExists = await fse.pathExists(path.join(repoPath, 'yarn.lock'));
  if (!yarnLockExists) {
    return 'npm';
  }

  return pkgJson.bolt ? 'bolt' : 'yarn';
}

async function installDependencies(
  repoPath: string,
  packageNames: string[],
  opts: Options,
) {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn',
    bolt: `bolt add ${packageNames.map(
      pkg => `${pkg}@file:.yalc/${pkg}`,
    )} && bolt`,
  };
  const repoType = await detectRepoType(repoPath);
  let installCmd = commands[repoType];
  let fullCommand = installCmd;
  if (opts.nvm) {
    /* We need to unset environment variables set by yarn that conflict with nvm since this is run as a yarn script.
     * We also deactivate nvm before running `nvm use` so that the nvm node version is
     * prepended to the start of path, which is required since yarn prepends its own
     * node version that is then always used if we don't override it by reactivating.
     * Finally we modify the NODE env var since some preinstall scripts use that to check version.
     */
    fullCommand = `unset PREFIX && unset \${!npm_@} && unset YARN_IGNORE_PATH && source "$NVM_DIR/nvm.sh" && nvm deactivate && nvm use && NODE="$NVM_BIN/node" ${fullCommand}`;
  }
  fullCommand = `cd "${repoPath}" && ${fullCommand}`;
  try {
    await runCommands([fullCommand], {
      linePrefix: chalk.blue('Installing deps:'),
      stripAnsi: true,
    });
  } catch (e) {
    console.error(
      chalk.red(
        `Installing dependencies failed, try running the command in the repo manually: ${installCmd}`,
      ),
    );
  }
}

export default async function main(
  repoPath: string,
  packages: string[],
  opts: Options = {},
) {
  opts = { ...defaultOptions, ...opts };
  if (opts.entry) {
    console.warn(chalk.yellow('Entry flag not supported yet'));
  }
  if (!repoPath || !packages || packages.length === 0) {
    throw new ValidationError('Must specify repoPath and at least one package');
  }

  const workspaces = await bolt.getWorkspaces({ cwd: opts.cwd });

  const missingPackages: string[] = [];
  const resolvedPackages = packages
    .map(pkgName => {
      const workspace = workspaces.find(w =>
        [w.name, w.name.replace(scopeRegex, '')].includes(pkgName),
      );
      if (!workspace) {
        missingPackages.push(pkgName);
      }
      return workspace;
    })
    .filter(isDefined);

  if (missingPackages.length > 0) {
    throw new ValidationError(
      `Could not find the following packages: ${missingPackages.join(', ')}
Provide either full name (@atlaskit/foo) or unscoped name (foo).`,
    );
  }

  const restoreConsoleLog = prefixConsoleLog(chalk.blue('Yalc:'));

  for (const pkg of resolvedPackages) {
    await yalc.publishPackage({
      workingDir: pkg.dir,
    });
  }

  const project = await bolt.getProject({ cwd: opts.cwd });
  // Repo path is relative to the root directory of the project (atlaskit)
  const resolvedRepoPath = path.resolve(project.dir, repoPath);
  const repoType = await detectRepoType(resolvedRepoPath);
  const packageNames = resolvedPackages.map(p => p.name);
  await yalc.addPackages(packageNames, {
    workingDir: resolvedRepoPath,
    /* We install the packages in 'pure' mode so the package.json isn't modified in the target repo. We rely on the `bolt add`
     * command to install in node_modules instead.
     * Once package.json is modified, the `bolt add` command that we need to run to upgrade all workspaces to the local install won't work
     * because yarn complains of an 'Outdated lockfile' check.
     * If we run `bolt` beforehand to not have an outdated lockfile, the workspace dependency version validation step
     * fail.
     */
    pure: repoType === 'bolt',
  });

  restoreConsoleLog();

  await installDependencies(resolvedRepoPath, packageNames, opts);

  if (repoType === 'bolt') {
    /* Re-add the packages for bolt repos with pure set to false so that subsequent yalc pushes from
     * the build actually update node_modules */
    const restoreConsoleLog = prefixConsoleLog(chalk.blue('Yalc:'));
    await yalc.addPackages(packageNames, {
      workingDir: resolvedRepoPath,
      pure: false,
    });
    restoreConsoleLog();
  }
}

if (require.main === module) {
  const cli = meow(
    `
    Usage
        $ link-pkg <repo> <package> [package2 ...]

      where <repo> is a path relative to the atlaskit root directory
      and packages are package names with scope optionally removed

      Options
        --no-nvm             Disable using nvm when installing in <repo>

      Examples
        $ link-pkg ../confluence-frontend editor-core
`,
    {
      flags: {
        entry: {
          type: 'string',
        },
        nvm: {
          type: 'boolean',
          default: true,
        },
      },
    },
  );

  const [repo, ...packages] = cli.input;

  main(repo, packages, cli.flags).catch(e => {
    if (e instanceof ValidationError) {
      console.error(chalk.red(e.message));
      cli.showHelp(2);
    }
    console.error(chalk.red(e));
    process.exit(1);
  });
}
