import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorPlugin, EditorProps } from '../../types';

export type PropsFlagsPluginState = { allowNewInsertionBehaviour?: boolean };

export const pluginKey = new PluginKey('sharedContextPlugin');

const sharedContextPlugin = (): EditorPlugin => ({
  name: 'sharedContext',
  pmPlugins() {
    return [
      {
        name: 'sharedContextPlugin',
        plugin: ({ props }) =>
          new Plugin({
            key: pluginKey,
            state: {
              init: (): EditorProps => props,
              apply: (_, pluginState) => pluginState,
            },
          }),
      },
    ];
  },
});

export const getEditorProps = (state: EditorState): EditorProps =>
  pluginKey.getState(state);

export default sharedContextPlugin;
