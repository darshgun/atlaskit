import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';

const paste: EditorPlugin = {
  pmPlugins() {
    return [
      {
        name: 'paste',
        plugin: ({ schema, props }) =>
          createPlugin(schema, props.UNSAFE_cards, props.collabEdit),
      },
    ];
  },
};

export default paste;
