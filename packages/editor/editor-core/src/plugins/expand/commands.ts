import {
  Transaction,
  NodeSelection,
  Selection,
  EditorState,
} from 'prosemirror-state';
import { Node as PMNode, NodeType } from 'prosemirror-model';
import { safeInsert, findTable } from 'prosemirror-utils';
import { createCommand } from './pm-plugins/main';
import { Command } from '../../types';
import { findExpand } from './utils';

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
  if (expandNode && dispatch) {
    dispatch(
      state.tr.delete(
        expandNode.pos,
        expandNode.pos + expandNode.node.nodeSize,
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
    // setCursorInsideExpand(pos, tr, -1);
    dispatch(tr);
  }
  return true;
};

export const setCursorInsideExpand = (
  pos: number,
  tr: Transaction,
  dir: number,
) => {
  const sel = Selection.findFrom(tr.doc.resolve(pos), dir, true);
  if (sel) {
    return tr.setSelection(sel);
  }
  return tr;
};

export const createExpandNode = (state: EditorState): PMNode => {
  const { expand, nestedExpand } = state.schema.nodes;
  const expandType = findTable(state.selection) ? nestedExpand : expand;
  return expandType.createAndFill({});
};

export const insertExpand: Command = (state, dispatch) => {
  const node = createExpandNode(state);

  if (dispatch) {
    dispatch(safeInsert(node)(state.tr).scrollIntoView());
  }

  return true;
};
