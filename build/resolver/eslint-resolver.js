/**
 * This file is used to resolve imports in eslint.
 */
const path = require('path');
const baseResolver = require('./base-resolver');

exports.interfaceVersion = 2;

exports.resolve = (source, file, config = {}) => {
  let resolved;

  try {
    resolved = baseResolver(source, {
      basedir: path.dirname(file),
    });
  } catch (e) {
    if (config.debug) {
      console.error(e);
    }
  }

  return {
    found: typeof resolved === 'string',
    path: resolved ? resolved : null,
  };
};
