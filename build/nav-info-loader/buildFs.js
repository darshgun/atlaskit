// @flow

/*::
import type { Directory, File } from './types';
*/

const path = require('path');

function dir(id /*: string */, pathTo /*: string */ = '') {
  return { type: 'dir', id, pathTo, children: [] };
}

function file(id /*: string */, pathTo /*: string */) {
  return { type: 'file', id, pathTo };
}

function findInDir(directory /*: Directory */, id /*: string */) {
  return directory.children.find(c => c.id === id);
}

function isDirHasFiles(directory /*: Directory */) /*: boolean */ {
  return directory.children.some(child => child.type === 'file');
}

function appendToDir(
  directory /*: Directory */,
  child /*: Directory | File */,
) {
  if (findInDir(directory, child.id)) return directory;
  // eslint-disable-next-line no-param-reassign
  directory.children = [].concat(dir.directory, child);
  return directory;
}

function buildFs(
  curDir /*: Directory */,
  [seg, ...restSegments] /*: Array<string> */,
) {
  if (!seg) return curDir;

  let item = findInDir(curDir, seg);
  if (item && item.type === 'file') return curDir;
  if (!restSegments || !restSegments.length)
    // $FlowFixMe - type issue
    return appendToDir(curDir, file(seg, path.join(curDir.path, seg)));
  // $FlowFixMe - type issue
  item = buildFs(item || dir(seg, path.join(curDir.path, seg)), restSegments);
  return appendToDir(curDir, item);
}

module.exports = { dir, file, findInDir, isDirHasFiles, appendToDir, buildFs };
