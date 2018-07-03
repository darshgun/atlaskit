//@flow
import type { Path, FlattenedTree } from '../types';

import { isTopOfSubtree, hasSameParent } from './path';

export const getFlatItemPath = (
  flattenedTree: FlattenedTree,
  sourceIndex: number,
): Path => flattenedTree[sourceIndex].path;

/*
  Calculates the source path after drag&drop ends
 */
export const getSourcePath = getFlatItemPath;

/*
    Calculates the destination path after drag&drop ends
  
    During dragging the items are displaced based on the location of the dragged item.
    Displacement depends on which direction the item is coming from.
  
    index
          -----------        -----------
    0     | item 0           | item 1 (displaced)
          -----------        -----------
    1     | item 1           | item 2 (displaced)
          -----------  --->  -----------      -----------
    2     | item 2                            | item 0 (dragged)
          -----------        -----------      -----------
    3     | item 3           | item 3
          -----------        -----------
  
   */
export const getDestinationPath = (
  flattenedTree: FlattenedTree,
  sourceIndex: number,
  destinationIndex: number,
): Path => {
  // Moving down
  const down: boolean = destinationIndex > sourceIndex;
  // Stayed at the same place
  const samePlace: boolean = destinationIndex === sourceIndex;
  // Path of the source location
  const sourcePath: Path = getSourcePath(flattenedTree, sourceIndex);
  // Path of the upper item where the item was dropped
  const upperPath: ?Path = down
    ? flattenedTree[destinationIndex].path
    : flattenedTree[destinationIndex - 1] &&
      flattenedTree[destinationIndex - 1].path;
  // Path of the lower item where the item was dropped
  const lowerPath: ?Path =
    down || samePlace
      ? flattenedTree[destinationIndex + 1] &&
        flattenedTree[destinationIndex + 1].path
      : flattenedTree[destinationIndex].path;

  if (samePlace) {
    // We do nothing
    return sourcePath;
  }

  /*
      We are going to differentiate between 3 cases:
        - item moved to the top of a list
        - item moved between two items on the same level
        - item moved to the end of list. This is an ambiguous case.
     */

  // Top of the list
  if (lowerPath && isTopOfSubtree(upperPath, lowerPath)) {
    return lowerPath;
  }

  // Between two items on the same level
  if (upperPath && lowerPath && hasSameParent(upperPath, lowerPath)) {
    if (down && hasSameParent(upperPath, sourcePath)) {
      // if item was moved down within the list, it will replace the displaced item
      return upperPath;
    }
    return lowerPath;
  }

  // End of list
  // this means that the upper item is deeper in the tree.
  if (upperPath) {
    const lowerLevel = lowerPath ? lowerPath.length : 1;
    const upperLevel = upperPath ? upperPath.length : 1;
    const sourceLevel = sourcePath.length;
    // Disambiguation of the level.
    const finalLevel = sourceLevel <= lowerLevel ? lowerLevel : upperLevel;

    if (finalLevel === upperLevel) {
      // Insert to the upper list
      const newPath = [...upperPath];
      if (!hasSameParent(upperPath, sourcePath)) {
        newPath[newPath.length - 1] += 1;
      }
      return newPath;
    }

    // Insert to the lower list
    const itemAfterWeInsert = upperPath.slice(0, finalLevel);
    const newPath = [...itemAfterWeInsert];
    if (!hasSameParent(itemAfterWeInsert, sourcePath) || !down) {
      newPath[newPath.length - 1] += 1;
    }
    return newPath;
  }

  // impossible case
  return sourcePath;
};
