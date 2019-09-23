import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import classnames from 'classnames';
import { getResizeCellPos } from './utils';
import {
  ColumnResizingPluginState,
  TableCssClassName as ClassName,
} from '../../types';
import { Dispatch } from '../../../../event-dispatcher';
import { handleMouseDown } from './event-handlers';
import { pluginFactory } from '../../../../utils/plugin-state-factory';
import reducer from './reducer';
import { setResizeHandlePos } from './commands';

export const pluginKey = new PluginKey('tableFlexiColumnResizing');

function mapping(
  tr: Transaction,
  pluginState: ColumnResizingPluginState,
): ColumnResizingPluginState {
  if (pluginState && pluginState.resizeHandlePos !== null) {
    return {
      ...pluginState,
      resizeHandlePos: tr.mapping.map(pluginState.resizeHandlePos),
    };
  }
  return pluginState;
}

const { createPluginState, createCommand, getPluginState } = pluginFactory(
  pluginKey,
  reducer,
  {
    mapping,
  },
);

export function createPlugin(
  dispatch: Dispatch<ColumnResizingPluginState>,
  {
    lastColumnResizable = true,
    dynamicTextSizing = false,
  }: ColumnResizingPluginState,
) {
  return new Plugin({
    key: pluginKey,
    state: createPluginState(dispatch, {
      lastColumnResizable,
      dynamicTextSizing,
      resizeHandlePos: null,
      dragging: null,
      lastClick: null,
    }),

    props: {
      attributes(state) {
        const pluginState = getPluginState(state);

        return {
          class: classnames(ClassName.RESIZING_PLUGIN, {
            [ClassName.RESIZE_CURSOR]: pluginState.resizeHandlePos !== null,
            [ClassName.IS_RESIZING]: !!pluginState.dragging,
          }),
        };
      },

      handleDOMEvents: {
        mousedown(view, event) {
          const { state } = view;
          const resizeHandlePos =
            // we're setting `resizeHandlePos` via command in unit tests
            getPluginState(state).resizeHandlePos ||
            getResizeCellPos(view, event as MouseEvent, lastColumnResizable);

          const { dragging } = getPluginState(state);
          if (resizeHandlePos !== null && !dragging) {
            if (
              handleMouseDown(
                view,
                event as MouseEvent,
                resizeHandlePos,
                dynamicTextSizing,
              )
            ) {
              const { state, dispatch } = view;
              return setResizeHandlePos(resizeHandlePos)(state, dispatch);
            }
          }

          return false;
        },
      },
    },
  });
}

export { createCommand, getPluginState };
