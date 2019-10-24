/**
 * We are using jest-runner-eslint to execute eslint rules in parallel, resulting in faster builds.
 */
/* eslint-disable flowtype/require-valid-file-annotation */
const config = {
  runner: 'jest-runner-eslint',
  testMatch: ['<rootDir>/**/*.(js|tsx|ts)'],
  watchPlugins: ['jest-runner-eslint/watch-fix'],
};

module.exports = config;
