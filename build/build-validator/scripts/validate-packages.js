#!/usr/bin/env node
// @flow
const fse = require('fs-extra');
const path = require('path');
const packlist = require('npm-packlist');
const childProcess = require('child_process');
const fetchNpmDeps = require('./fetch-npm-deps');
const { getAllPublicPackages } = require('./utils');

function copyFiles(srcDir, destDir, files) {
  return Promise.all(
    files.map(f => fse.copy(path.join(srcDir, f), path.join(destDir, f))),
  );
}

function toString(bufferOrStr) {
  return bufferOrStr instanceof Buffer
    ? bufferOrStr.toString('utf-8')
    : bufferOrStr;
}

// Spawns cmd and logs output/stderr to console
// Returns a promise that resolves when the process exits completely and rejects otherwise
function spawnPromise(cmd, args, opts /*: Object */ = {}) {
  return new Promise((resolve, reject) => {
    let finished = false;
    function done(code, signal) {
      // Guard against done being called multiple times
      if (finished) {
        return;
      }
      finished = true;
      let error;
      if (code != null && code !== 0) {
        error = new Error(`Process exited with code ${code}`);
      } else if (signal != null) {
        error = new Error(`Process was terminated with ${signal}`);
      }
      if (error) {
        // $FlowFixMe - code & signal
        error.code = code;
        // $FlowFixMe - code & signal
        error.signal = signal;
        reject(error);
      } else {
        resolve();
      }
    }
    const spawnedCmd = childProcess.spawn(cmd, args, opts);
    spawnedCmd.stdout.on('data', data => {
      console.log(toString(data));
    });
    spawnedCmd.stderr.on('data', data => {
      console.error(toString(data));
    });

    spawnedCmd.on('error', reject);
    spawnedCmd.on('close', done);
    spawnedCmd.on('exit', done);
  });
}

async function validatePackage(pkgName, pkgDir, quiet, refetch = false) {
  const npmDistPath = await fetchNpmDeps(pkgName, {
    refetch,
  });
  const tmpDir = path.join(pkgDir, 'tmp');
  try {
    await fse.remove(tmpDir);
    await fse.mkdir(tmpDir);
    const packedRepoFiles = await packlist({ path: pkgDir });
    // Copy files that would be published to a temp dir for easy diffing
    await copyFiles(pkgDir, tmpDir, packedRepoFiles);
    let valid = true;
    try {
      console.log(`Comparing ${pkgName}...`);
      await spawnPromise('diff', [
        `-${quiet ? 'q' : ''}ur`,
        npmDistPath,
        tmpDir,
      ]);
      console.log(`${pkgName} passed validation`);
    } catch (e) {
      if (e.code === 1) {
        // If exit code is 1, there is a diff between the two dirs
        valid = false;
        console.error(`${pkgName} differs from npm`);
      } else {
        throw e;
      }
    }
    await fse.remove(tmpDir);

    return valid;
  } catch (e) {
    // Cleanup temp dir before propogating any errors
    await fse.remove(tmpDir);
    throw e;
  }
}

/**
 * validate-packages
 *
 * Validates `packageName` in the repo against what is downloaded from npm in `dists` folder
 *
 * @param `packageName` string Name of the package to validate. If missing will validate all packages
 * @param `opts` {
 *  `quiet`: boolean Whether to only show files that have changed or the whole file diffs
 *  `refetch`: boolean Whether to refetch the package from npm before comparing
 * }
 *
 * Assumes that the package has already been built.
 *
 * If no `packageName` is passed, compares all packages under `optionalDependencies`.
 */
async function main(pkgName /*: string */, opts /*: Object */) {
  const allPackages = await getAllPublicPackages(
    path.join(process.cwd(), '..'),
  );
  if (pkgName) {
    const resolvedPkg = allPackages.find(p => p.name === pkgName);
    if (!resolvedPkg) {
      throw Error(
        `Dependency ${pkgName} is not a public package in the atlaskit repo.`,
      );
    }
    // Compare single package
    return validatePackage(
      resolvedPkg.name,
      resolvedPkg.dir,
      opts.quiet,
      opts.refetch,
    );
  }
  // Compare all
  // Fetch deps first in parallel
  await fetchNpmDeps(undefined, {
    force: opts.refetch,
  });

  const results = [];
  // Executing sequentially makes output more readable
  for (const { dir, name } of allPackages) {
    // Set refetch to false since we've already fetched beforehand
    const valid = await validatePackage(name, dir, opts.quiet, false);
    results.push({ name, valid });
  }

  const validPackages = results.filter(({ valid }) => valid);
  const invalidPackages = results.filter(({ valid }) => !valid);

  console.log(`Validated ${results.filter(p => !!p).length} packages`);

  if (validPackages.length > 0) {
    console.log(`${validPackages.length} packages passed validation`);
    console.log(`${validPackages.map(p => p.name).join(', ')}`);
  }

  if (invalidPackages.length > 0) {
    console.error(`${invalidPackages.length} packages failed validation`);
    console.error(`${invalidPackages.map(p => p.name).join(', ')}`);
  }

  return invalidPackages.length === 0;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const requiredArgs = args.filter(a => !a.startsWith('--'));
  const flags = args.filter(a => a.startsWith('--'));
  const pkgName = requiredArgs[0];
  const opts = {
    quiet: flags.includes('--quiet'),
    refetch: flags.includes('--refetch'),
  };
  main(pkgName, opts)
    .then(success => {
      if (!success) {
        console.error('Validation failed, exiting with non-zero status code');
        process.exit(1);
      }
    })
    .catch(e => {
      console.error(e);
      process.exit(2);
    });
}

module.exports = main;
