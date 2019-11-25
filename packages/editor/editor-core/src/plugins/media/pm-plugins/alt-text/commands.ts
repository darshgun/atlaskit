import { createCommand } from '.';
import {
  isSelectionMediaSingleNode,
  getMediaNodeFromSelection,
} from '../../utils/media-common';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  withAnalytics,
  ACTION_SUBJECT_ID,
} from '../../../analytics';
import { EditorState, Transaction } from 'prosemirror-state';
import { withAnalytics as withV2Analytics } from '../../../../analytics';
import { Action } from 'redux';
import {
  ALT_TEXT_ACTION,
  MediaImageAltTextAEP,
} from '../../../analytics/types/media-events';

const createCommandWithAnalytics = (
  actionType: ALT_TEXT_ACTION,
  action: Action | ((state: Readonly<EditorState>) => Action | false),
  transform?: (tr: Transaction, state: EditorState) => Transaction,
) => {
  return withAnalytics(state => {
    const altTextAEP: MediaImageAltTextAEP = {
      action: actionType,
      actionSubject: ACTION_SUBJECT.MEDIA,
      actionSubjectId: ACTION_SUBJECT_ID.MEDIA,
      eventType: EVENT_TYPE.UI,
    };
    return altTextAEP;
  })(
    withV2Analytics(
      `atlassian.editor.format.media.altText.${actionType}`,
      createCommand(action, transform),
    ),
  );
};

export const closeMediaAltTextMenu = createCommandWithAnalytics(
  ALT_TEXT_ACTION.CLOSED,
  state => {
    if (isSelectionMediaSingleNode(state)) {
      return { type: 'closeMediaAltTextMenu' };
    }
    return false;
  },
);

export const openMediaAltTextMenu = createCommandWithAnalytics(
  ALT_TEXT_ACTION.OPENED,
  state => {
    if (isSelectionMediaSingleNode(state)) {
      return { type: 'openMediaAltTextMenu' };
    }
    return false;
  },
);

export const updateAltText = (newAltText: string | null) =>
  createCommand(
    state =>
      isSelectionMediaSingleNode(state) ? { type: 'updateAltText' } : false,
    (tr, state) => {
      const mediaNode = getMediaNodeFromSelection(state);
      const pos = tr.selection.from + 1;
      if (mediaNode) {
        tr.setNodeMarkup(pos, undefined, {
          ...mediaNode.attrs,
          alt: newAltText,
        });
      }

      return tr;
    },
  );
