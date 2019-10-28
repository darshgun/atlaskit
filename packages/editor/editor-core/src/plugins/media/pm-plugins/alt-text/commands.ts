import { createCommand } from '.';
import { isSelectionMediaSingleNode } from '../../utils/media-common';

export const closeMediaAltTextMenu = createCommand(state => {
  if (isSelectionMediaSingleNode(state)) {
    return { type: 'closeMediaAltTextMenu' };
  }
  return false;
});

export const openMediaAltTextMenu = createCommand(state => {
  if (isSelectionMediaSingleNode(state)) {
    return { type: 'openMediaAltTextMenu' };
  }
  return false;
});

export const updateAltText = (newAltText: string) =>
  createCommand(
    state => {
      return { type: 'updateAltText' };
    },
    tr => {
      // tr.setNodeMarkup(pos, undefined, { alt: newAltText });
      return tr;
    },
  );
