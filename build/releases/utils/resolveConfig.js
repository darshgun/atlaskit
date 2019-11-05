/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// @flow
const path = require('path');
const fs = require('fs-extra');
const logger = require('@atlaskit/build-utils/logger');

const getChangesetBase = require('./getChangesetBase');

async function resolveConfig(config /*: Object*/) {
  const changesetBase = await getChangesetBase(config.cwd);

  const configPath = path.resolve(changesetBase, 'config.js');
  const hasConfigFile = await fs.pathExists(configPath);

  if (hasConfigFile) {
    try {
      // $StringLitteral
      const loadedConfig = require(configPath);
      return loadedConfig;
    } catch (error) {
      // $FlowFixMe - fix logger
      logger.error('There was an error reading your changeset config', error);
      throw error;
    }
  } else {
    return {};
  }
}

module.exports = resolveConfig;
