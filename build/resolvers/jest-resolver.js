// @flow
/**
 * This file is used to resolve imports in jest.
 */
const baseResolver = require('./base-resolver');

module.exports = function resolver(
  modulePath /*: string */,
  params /*: Object */,
) {
  return baseResolver(modulePath, {
    basedir: params.basedir,
  });
};
