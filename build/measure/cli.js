#!/usr/bin/env node
// @flow
/* eslint-disable no-shadow */
const meow = require('meow');
const chalk = require('chalk');
const bolt = require('bolt');
const minimatch = require('minimatch');
const measure = require('./measure');

const c = meow(
  `
    Usage
        $ measure <[paths]>

      Options
        --analyze               Opens bundle analyzer report
        --json                  Outputs measure stats as json
        --lint                  Lint mode fails build if size has been increased beyond threshold
        --updateSnapshot        Update measure snapshots
        --s3                    Run S3 flow

      Examples
        $ measure editor-core editor-common
        $ measure editor-core --updateSnapshot
        $ measure editor-core --analyze
`,
  {
    flags: {
      analyze: {
        type: 'boolean',
        default: false,
      },
      json: {
        type: 'boolean',
        default: false,
      },
      lint: {
        type: 'boolean',
        default: false,
      },
      updateSnapshot: {
        type: 'boolean',
        default: false,
      },
      s3: {
        type: 'boolean',
        default: false,
      },
    },
  },
);

const paths = c.input;

if (paths && paths.length > 0) {
  resolvePaths(paths).then(resolvedPaths => {
    if (resolvedPaths.length > 0) {
      executeMeasure(resolvedPaths, c).then(handleMeasureResult);
    } else {
      logInvalidUse(`Pattern "${paths}" did not match any packages`);
    }
  });
} else {
  logInvalidUse('No paths specified, no packages to measure');
}

async function resolvePaths(paths) {
  const workspaces = await bolt.getWorkspaces();
  return workspaces
    .filter(ws =>
      paths.some(path => minimatch(ws.dir, `**/${path}`, { matchBase: true })),
    )
    .map(ws => ws.dir);
}

async function executeMeasure(paths, cParam, errors = [], results = []) {
  const path = paths.pop();

  try {
    const result = await measure(
      path,
      cParam.flags.analyze,
      cParam.flags.json,
      cParam.flags.lint,
      cParam.flags.updateSnapshot,
      cParam.flags.s3,
    );
    results.push(result);
  } catch (error) {
    errors.push(error);
  }

  if (paths.length > 0) {
    return executeMeasure(paths, cParam, errors, results);
  }
  return { errors, results };
}

function handleMeasureResult({ errors, results }) {
  const allPassed =
    results.reduce((overall, result) => overall + result, 0) === results.length;
  if (errors.length > 0) {
    console.log(
      chalk.red('\nBundle size build failed with the following errors:'),
    );

    errors.forEach(error => {
      console.log(`  ${chalk.red(error)}`);
    });

    logInvalidUse();
    process.exit(1);
  } else {
    if (!c.flags.s3) {
      console.warn(
        chalk.yellow(
          'The measure tool now stores s3 ratchet in s3, you can still run it locally, but the data maybe inaccurate.',
        ),
      );
    }
    if (c.flags.updateSnapshot) {
      console.log(chalk.green('Updated bundle size snapshots'));
    } else if (allPassed) {
      console.log(chalk.green('No significant bundle size changes detected'));
    } else if (c.flags.s3) {
      console.log(
        chalk.yellow(
          'The bundle size has been measured using s3 flag, please report to the add-on on your pull-request.',
        ),
      );
    } else {
      console.log(
        chalk.red(
          'One or more bundle sizes failed check, see above for details',
        ),
      );
    }
    console.log();

    process.exit(0);
  }
}

function logInvalidUse(message = '') {
  console.log(
    chalk.yellow(`\n  ${message}\n`),
    chalk.dim(
      `  Run ${chalk.yellow(
        'yarn measure --help',
      )} for more information on how to use this tool\n`,
    ),
  );
}
