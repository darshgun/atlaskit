import { Command } from '../../../types';
import {
  stateKey as mediaPluginKey,
  MediaPluginState,
  MediaNodeWithPosHandler,
} from '../pm-plugins/main';
import { findMediaNode, findAllMediaSingleNodes } from './helpers';
import { SetAttrsStep } from '../../../utils';

export const updateAllMediaNodesAttrs = (
  id: string,
  attrs: object,
  isMediaSingle: boolean,
): Command => (state, dispatch) => {
  const mediaPluginState: MediaPluginState = mediaPluginKey.getState(state);

  let mediaNodes: MediaNodeWithPosHandler[];
  if (isMediaSingle) {
    mediaNodes = findAllMediaSingleNodes(mediaPluginState, id);
  } else {
    const mediaGroupNode = findMediaNode(mediaPluginState, id, isMediaSingle);
    mediaNodes = mediaGroupNode ? [mediaGroupNode] : [];
  }

  // TODO: ED-7784 Clean media plugin state from having media that were previously removed.
  // Sanity check
  const mediaType = state.schema.nodes.media;
  mediaNodes = mediaNodes.filter(nodeWithPos => {
    let node;
    try {
      node = state.doc.nodeAt(nodeWithPos.getPos());
    } catch (e) {
      return false;
    }

    return node && node.type === mediaType;
  });

  if (mediaNodes.length === 0) {
    return false;
  }

  if (dispatch) {
    const tr = state.tr;
    mediaNodes.forEach(({ getPos }) =>
      tr.step(new SetAttrsStep(getPos(), attrs)),
    );
    tr.setMeta('addToHistory', false);
    dispatch(tr);
  }
  return true;
};

export const updateMediaNodeAttrs = (
  id: string,
  attrs: object,
  isMediaSingle: boolean,
): Command => (state, dispatch) => {
  const mediaPluginState: MediaPluginState = mediaPluginKey.getState(state);

  const mediaNodeWithPos = findMediaNode(mediaPluginState, id, isMediaSingle);

  if (!mediaNodeWithPos) {
    return false;
  }

  if (dispatch) {
    dispatch(
      state.tr
        .step(new SetAttrsStep(mediaNodeWithPos.getPos(), attrs))
        .setMeta('addToHistory', false),
    );
  }
  return true;
};

export const replaceExternalMedia = (pos: number, attrs: object): Command => (
  state,
  dispatch,
) => {
  if (dispatch) {
    dispatch(
      state.tr
        .step(
          new SetAttrsStep(pos, {
            type: 'file',
            url: null,
            ...attrs,
          }),
        )
        .setMeta('addToHistory', false),
    );
    return true;
  }
  return false;
};
