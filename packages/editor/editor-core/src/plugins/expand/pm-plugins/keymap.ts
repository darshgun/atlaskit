import { keymap } from 'prosemirror-keymap';
import { Plugin, Selection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { GapCursorSelection, Side } from '../../gap-cursor';
import { findExpand } from '../utils';
import { EditorView } from 'prosemirror-view';

const focusTitle = (view: EditorView, pos: number) => {
  const dom = view.domAtPos(pos);
  const expandWrapper = dom.node.parentElement;
  if (expandWrapper) {
    const input = expandWrapper.querySelector('input');
    if (input) {
      input.focus();
      return true;
    }
  }
  return false;
};

export function expandKeymap(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.moveRight.common!,
    (state, _dispatch, editorView) => {
      if (!editorView) {
        return false;
      }
      const { selection } = state;
      const { nodeAfter } = selection.$from;
      const { expand, nestedExpand } = state.schema.nodes;

      if (
        selection instanceof GapCursorSelection &&
        selection.side === Side.LEFT &&
        nodeAfter &&
        (nodeAfter.type === expand || nodeAfter.type === nestedExpand)
      ) {
        const { $from } = selection;
        return focusTitle(editorView, $from.pos + 1);
      }
      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveLeft.common!,
    (state, _dispatch, editorView) => {
      if (!editorView) {
        return false;
      }
      const { selection } = state;
      const { nodeBefore } = selection.$from;
      const { expand, nestedExpand } = state.schema.nodes;
      if (
        selection instanceof GapCursorSelection &&
        selection.side === Side.RIGHT &&
        nodeBefore &&
        (nodeBefore.type === expand || nodeBefore.type === nestedExpand)
      ) {
        const { $from } = selection;
        return focusTitle(editorView, Math.max($from.pos - 1, 0));
      }
      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    (state, dispatch, editorView) => {
      if (!editorView) {
        return false;
      }
      const { selection, schema } = state;
      const { nodeBefore } = selection.$from;
      if (
        selection instanceof GapCursorSelection &&
        selection.side === Side.RIGHT &&
        nodeBefore &&
        (nodeBefore.type === schema.nodes.expand ||
          nodeBefore.type === schema.nodes.nestedExpand) &&
        !nodeBefore.attrs.__expanded
      ) {
        const { $from } = selection;
        return focusTitle(editorView, Math.max($from.pos - 1, 0));
      }

      const { $from } = state.selection;
      if (editorView.endOfTextblock('up')) {
        const expand = findExpand(state);
        const prevCursorPos = Math.max($from.pos - $from.parentOffset - 1, 0);
        // move cursor from expand's content to its title
        if (expand && expand.start === prevCursorPos) {
          return focusTitle(editorView, expand.start);
        }

        const sel = Selection.findFrom(state.doc.resolve(prevCursorPos), -1);
        const expandBefore = findExpand(state, sel);
        if (sel && expandBefore) {
          // moving cursor from outside of an expand to the title when it is collapsed
          if (!expandBefore.node.attrs.__expanded) {
            return focusTitle(editorView, expandBefore.start);
          }
          // moving cursor from outside of an expand to the content when it is expanded
          else if (dispatch) {
            dispatch(state.tr.setSelection(sel));
          }
          return true;
        }
      }

      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    (state, dispatch, editorView) => {
      if (!editorView) {
        return false;
      }
      const { expand, nestedExpand } = state.schema.nodes;
      const { selection } = state;
      const { nodeAfter } = selection.$from;

      if (
        selection instanceof GapCursorSelection &&
        selection.side === Side.LEFT &&
        nodeAfter &&
        (nodeAfter.type === expand || nodeAfter.type === nestedExpand) &&
        !nodeAfter.attrs.__expanded
      ) {
        const { $from } = selection;
        return focusTitle(editorView, $from.pos + 1);
      }

      if (editorView.endOfTextblock('down')) {
        const { $from } = state.selection;
        const $after = state.doc.resolve($from.after());
        if (
          $after.nodeAfter &&
          ($after.nodeAfter.type === expand ||
            $after.nodeAfter.type === nestedExpand)
        ) {
          return focusTitle(editorView, $after.pos + 1);
        }
      }
      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    (state, dispatch) => {
      const { selection } = state;
      const expandNode = findExpand(state);
      if (!expandNode || !selection.empty) {
        return false;
      }
      const textSel = Selection.findFrom(
        state.doc.resolve(expandNode.pos),
        1,
        true,
      );
      if (textSel && selection.$from.pos === textSel.$from.pos) {
        if (dispatch) {
          dispatch(
            state.tr.delete(
              expandNode.pos,
              expandNode.pos + expandNode.node.nodeSize,
            ),
          );
        }
        return true;
      }

      return false;
    },
    list,
  );

  return keymap(list);
}
