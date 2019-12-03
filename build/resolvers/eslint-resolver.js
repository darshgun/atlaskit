// @flow
/**
 * This file is used to resolve imports in eslint.
 */
const path = require('path');
const baseResolver = require('./base-resolver');

exports.interfaceVersion = 2;

exports.resolve = (
  source /*: string */,
  file /*: string */,
  config /*: Object */ = {},
) => {
  let resolved;

  // Remove webpack loader prefix
  const lastExclam = source.lastIndexOf('!');
  if (lastExclam !== -1) {
    // eslint-disable-next-line no-param-reassign
    source = source.slice(lastExclam + 1);
  }

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
    path: resolved || null,
  };
};
