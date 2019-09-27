/**
 * @file portal.ts
 *
 * Links packages to another repo
 */
import * as bolt from 'bolt';
import fse from 'fs-extra';
import meow from 'meow';
import path from 'path';
import * as yalc from 'yalc';
import runCommands from '@atlaskit/build-utils/runCommands';

function isDefined<T>(arg: T | undefined): arg is T {
  return arg !== undefined;
}

export type Options = {
  cwd?: string;
  entry?: string;
  nvm?: boolean;
};

const defaultOptions = {
  nvm: true,
};
const scopeRegex = /@[^\/]+\//;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

async function detectRepoType(
  repoPath: string,
): Promise<'yarn' | 'bolt' | 'npm'> {
  const yarnLockExists = await fse.pathExists(path.join(repoPath, 'yarn.lock'));
  if (!yarnLockExists) {
    return 'npm';
  }

  const pkgJson = await fse.readJson(path.join(repoPath, 'package.json'));

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
    bolt: `bolt && bolt upgrade ${packageNames.map(
      pkg => `${pkg}@file:.yalc/${pkg}`,
    )}`,
  };
  const repoType = await detectRepoType(repoPath);
  let installCmd = commands[repoType];
  let fullCommand = installCmd;
  if (opts.nvm) {
    // We need to unset environment variables set by yarn that conflict with nvm
    // This occurs because we run this as a yarn script
    fullCommand = `unset PREFIX && unset npm_config_prefix && source ~/.nvm/nvm.sh && nvm use && ${fullCommand}`;
  }
  fullCommand = `cd "${repoPath}" && ${fullCommand}`;
  try {
    await runCommands([fullCommand]);
  } catch (e) {
    console.error(
      `Installing dependencies failed, try running the command in the repo manually: ${installCmd}`,
    );
  }
}

export default async function main(
  repoPath: string,
  packages: string[],
  opts: Options = {},
) {
  const options = { ...defaultOptions, ...opts };
  if (options.entry) {
    console.warn('Entry flag not supported yet');
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

  for (const pkg of resolvedPackages) {
    await yalc.publishPackage({
      workingDir: pkg.dir,
    });
  }

  const project = await bolt.getProject({ cwd: options.cwd });
  // Repo path is relative to the parent directory of the project (atlaskit)
  const resolvedRepoPath = path.resolve(project.dir, '..', repoPath);
  const packageNames = resolvedPackages.map(p => p.name);
  await yalc.addPackages(resolvedPackages.map(p => p.name), {
    workingDir: resolvedRepoPath,
  });

  await installDependencies(resolvedRepoPath, packageNames, opts);
}

if (require.main === module) {
  const cli = meow(
    `
    Usage
        $ portal <repo> <package> [package2 ...]

      where <repo> is a path relative to the atlaskit repo's parent directory
      and packages are package names with scope optionally removed

      Options
        --entry [package]    Links package(s) through the entry package
        --no-nvm             Disable using nvm when installing in <repo>

      Examples
        $ portal confluence-frontend editor-core
        $ portal confluence-frontend media-card --entry editor-core
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
      console.error(e.message);
      cli.showHelp(2);
    }
    console.error(e);
    process.exit(1);
  });
}
