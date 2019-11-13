// @flow

/*::
import type { Directory, File } from './types';
*/

const nodePath = require('path');

function dir(id /*: string */, path /*: string */ = '') {
  return { type: 'dir', id, path, children: [] };
}

function file(id /*: string */, path /*: string */, rootDir /*: string */) {
  return { type: 'file', id, path, uid: nodePath.relative(rootDir, path) };
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
  directory.children = [].concat(directory.children, child);
  return directory;
}

function buildFs(
  curDir /*: Directory */,
  [seg, ...restSegments] /*: Array<string> */,
  rootDir /*: string */,
) {
  if (!seg) return curDir;

  let item = findInDir(curDir, seg);
  if (item && item.type === 'file') return curDir;
  if (!restSegments || !restSegments.length)
    return appendToDir(
      curDir,
      file(seg, nodePath.join(curDir.path, seg), rootDir),
    );

  item = buildFs(
    item || dir(seg, nodePath.join(curDir.path, seg)),
    restSegments,
    rootDir,
  );
  return appendToDir(curDir, item);
}

module.exports = { dir, file, findInDir, isDirHasFiles, appendToDir, buildFs };
