import { EditorState } from 'prosemirror-state';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { Slice, Schema } from 'prosemirror-model';
import { mapSlice } from '../../utils/slice';

export const findExpand = (state: EditorState) => {
  const { expand, nestedExpand } = state.schema.nodes;
  return (
    findSelectedNodeOfType([expand, nestedExpand])(state.selection) ||
    findParentNodeOfType([expand, nestedExpand])(state.selection)
  );
};

export const transformSliceNestedExpandToExpand = (
  slice: Slice,
  schema: Schema,
): Slice => {
  const { expand, nestedExpand } = schema.nodes;

  return mapSlice(slice, maybeNode => {
    if (maybeNode.type === nestedExpand) {
      return expand.createChecked(
        maybeNode.attrs,
        maybeNode.content,
        maybeNode.marks,
      );
    }
    return maybeNode;
  });
};
