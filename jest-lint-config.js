/* eslint-disable flowtype/require-valid-file-annotation */
const config = {
  runner: 'jest-runner-eslint',
  testMatch: [`${__dirname}/**/*.(js|tsx|ts)`],
};

if (process.env.CI) {
  config.maxWorkers = '50%';
}

module.exports = config;
