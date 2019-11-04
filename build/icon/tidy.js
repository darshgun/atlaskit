/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
// @flow
const fs = require('fs-extra');

/*::
type Config = {
  srcDir: string,
  processedDir: string,
  destDir: string,
  glob: string,
  maxWidth: number,
  maxHeight: number,
  size?: string
};
*/

// $FlowFixMe
module.exports = tidy = (config /*: Config */) =>
  fs.emptyDir(config.processedDir).then(() => fs.emptyDir(config.destDir));
