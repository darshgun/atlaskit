// @flow
const getAlternativeEntryPointAliasMap = require('@atlaskit/multi-entry-tools/module-resolve-map-builder');
const fs = require('fs-extra');

getAlternativeEntryPointAliasMap().then(aliases =>
  fs.writeFile('./aliases-written-map.json', JSON.stringify(aliases)),
);
