// @flow
const fs = require('fs');
const gzipSize = require('gzip-size');
const exec = require('child_process').execSync;

function fStats(filePath /*: string */) {
  return {
    size: fs.statSync(filePath).size,
    gzipSize: gzipSize.sync(fs.readFileSync(filePath)),
  };
}

function fExists(filePath /*: string */) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
}

function fDeleteIfExist(dir /*: string */) {
  if (fExists(dir)) {
    try {
      exec(`rm -rf ${dir}`);
    } catch (e) {
      console.error(`${e}`);
    }
  }
}

module.exports = { fStats, fExists, fDeleteIfExist };
