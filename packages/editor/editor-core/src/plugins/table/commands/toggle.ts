//#region Imports
import { toggleHeader } from 'prosemirror-tables';
import { findTable } from 'prosemirror-utils';
import { TableLayout } from '@atlaskit/adf-schema';
import { createCommand } from '../pm-plugins/main';
import { Command } from '../../../types';
//#endregion

// #region Utils
/**
 * Table layout toggle logic
 * default -> wide -> full-width -> default
 */
export const getNextLayout = (currentLayout: TableLayout): TableLayout => {
  switch (currentLayout) {
    case 'default':
      return 'wide';
    case 'wide':
      return 'full-width';
    case 'full-width':
      return 'default';
    default:
      return 'default';
  }
};
// #endregion

// #region Actions
export const toggleHeaderRow: Command = toggleHeader('row');
export const toggleHeaderColumn: Command = toggleHeader('column');

export const toggleNumberColumn: Command = (state, dispatch) => {
  const { tr } = state;
  const { node, pos } = findTable(state.selection)!;

  tr.setNodeMarkup(pos, state.schema.nodes.table, {
    ...node.attrs,
    isNumberColumnEnabled: !node.attrs.isNumberColumnEnabled,
  });

  if (dispatch) {
    dispatch(tr);
  }
  return true;
};

export const toggleTableLayout: Command = (state, dispatch): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const layout = getNextLayout(table.node.attrs.layout);

  if (dispatch) {
    dispatch(
      state.tr.setNodeMarkup(table.pos, state.schema.nodes.table, {
        ...table.node.attrs,
        layout,
      }),
    );
  }
  return true;
};

export const toggleContextualMenu = () =>
  createCommand(
    {
      type: 'TOGGLE_CONTEXTUAL_MENU',
    },
    tr => tr.setMeta('addToHistory', false),
  );
// #endregion