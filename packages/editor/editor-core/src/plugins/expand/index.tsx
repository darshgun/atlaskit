import * as React from 'react';
import { expand, nestedExpand } from '@atlaskit/adf-schema';
import { EditorPlugin, EditorProps } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { expandKeymap } from './pm-plugins/keymap';
import { messages } from '../insert-block/ui/ToolbarInsertBlock';
import { IconExpand } from '../quick-insert/assets';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { getToolbarConfig } from './toolbar';
import { createExpandNode } from './commands';

interface ExpandPluginOptions {
  allowInsertion?: boolean;
}

const expandPlugin = (options?: ExpandPluginOptions): EditorPlugin => ({
  name: 'expand',

  nodes() {
    return [
      { name: 'expand', node: expand },
      { name: 'nestedExpand', node: nestedExpand },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'expand',
        plugin: ({ dispatch, reactContext }) => {
          return createPlugin(dispatch, reactContext);
        },
      },
      {
        name: 'expandKeymap',
        plugin: expandKeymap,
      },
    ];
  },

  pluginsOptions: {
    floatingToolbar: getToolbarConfig,

    quickInsert: ({ formatMessage }) => {
      if (options && options.allowInsertion !== true) {
        return [];
      }
      return [
        {
          title: formatMessage(messages.expand),
          description: formatMessage(messages.expandDescription),
          priority: 600,
          icon: () => <IconExpand label={formatMessage(messages.expand)} />,
          action(insert, state) {
            const node = createExpandNode(state);
            const tr = insert(node);
            return addAnalytics(state, tr, {
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.DOCUMENT,
              actionSubjectId:
                node.type === state.schema.nodes.nestedExpand
                  ? ACTION_SUBJECT_ID.NESTED_EXPAND
                  : ACTION_SUBJECT_ID.EXPAND,
              attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
              eventType: EVENT_TYPE.TRACK,
            });
          },
        },
      ];
    },
  },
});

export default expandPlugin;
export { ExpandPluginState } from './types';
export { pluginKey } from './pm-plugins/main';
export function isExpandInsertionEnabled({ UNSAFE_allowExpand }: EditorProps) {
  if (UNSAFE_allowExpand && typeof UNSAFE_allowExpand === 'object') {
    return !!UNSAFE_allowExpand.allowInsertion;
  }

  return false;
}
