import { createCommand } from '.';
import { isSelectionMediaNode } from '../../utils/media-common';

export const closeMediaAltTextMenu = createCommand(state => {
  if (isSelectionMediaNode(state)) {
    return { type: 'closeMediaAltTextMenu' };
  }
  return false;
});

export const openMediaAltTextMenu = createCommand(state => {
  if (isSelectionMediaNode(state)) {
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
