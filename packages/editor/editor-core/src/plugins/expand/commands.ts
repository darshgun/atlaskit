import { NodeSelection, EditorState } from 'prosemirror-state';
import { Node as PMNode, NodeType } from 'prosemirror-model';
import { safeInsert, findTable } from 'prosemirror-utils';
import { createCommand } from './pm-plugins/main';
import { Command } from '../../types';
import { findExpand } from './utils';
import {
  addAnalytics,
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  EVENT_TYPE,
} from '../analytics';

export const setExpandRef = (ref?: HTMLDivElement | null): Command =>
  createCommand(
    {
      type: 'SET_EXPAND_REF',
      data: {
        ref,
      },
    },
    tr => tr.setMeta('addToHistory', false),
  );

export const deleteExpand = (): Command => (state, dispatch) => {
  const expandNode = findExpand(state);
  if (!expandNode) {
    return false;
  }

  const payload: AnalyticsEventPayload = {
    action: ACTION.DELETED,
    actionSubject:
      expandNode.node.type === state.schema.nodes.expand
        ? ACTION_SUBJECT.EXPAND
        : ACTION_SUBJECT.NESTED_EXPAND,
    attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
    eventType: EVENT_TYPE.TRACK,
  };

  if (expandNode && dispatch) {
    dispatch(
      addAnalytics(
        state,
        state.tr.delete(
          expandNode.pos,
          expandNode.pos + expandNode.node.nodeSize,
        ),
        payload,
      ),
    );
  }
  return true;
};

export const selectExpand = (pos: number): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setSelection(new NodeSelection(state.doc.resolve(pos))));
  }
  return true;
};

export const updateExpandTitle = (
  title: string,
  pos: number,
  nodeType: NodeType,
): Command => (state, dispatch) => {
  const node = state.doc.nodeAt(pos);
  if (node && node.type === nodeType && dispatch) {
    const { tr } = state;
    tr.setNodeMarkup(
      pos,
      node.type,
      {
        ...node.attrs,
        title,
      },
      node.marks,
    );
    dispatch(tr);
  }
  return true;
};

export const toggleExpandExpanded = (
  pos: number,
  nodeType: NodeType,
): Command => (state, dispatch) => {
  const node = state.doc.nodeAt(pos);
  if (node && node.type === nodeType && dispatch) {
    const { tr } = state;
    tr.setNodeMarkup(
      pos,
      node.type,
      {
        ...node.attrs,
        __expanded: !node.attrs.__expanded,
      },
      node.marks,
    );
    dispatch(tr);
  }
  return true;
};

export const createExpandNode = (state: EditorState): PMNode => {
  const { expand, nestedExpand } = state.schema.nodes;
  const expandType = findTable(state.selection) ? nestedExpand : expand;
  return expandType.createAndFill({});
};

export const insertExpand: Command = (state, dispatch) => {
  const expandNode = createExpandNode(state);

  const payload: AnalyticsEventPayload = {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId:
      expandNode.type === state.schema.nodes.expand
        ? ACTION_SUBJECT_ID.EXPAND
        : ACTION_SUBJECT_ID.NESTED_EXPAND,
    attributes: { inputMethod: INPUT_METHOD.INSERT_MENU },
    eventType: EVENT_TYPE.TRACK,
  };

  if (dispatch) {
    dispatch(
      addAnalytics(
        state,
        safeInsert(expandNode)(state.tr).scrollIntoView(),
        payload,
      ),
    );
  }

  return true;
};
