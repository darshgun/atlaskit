import * as React from 'react';
import { expand, nestedExpand } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
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

const expandPlugin = (): EditorPlugin => ({
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

    quickInsert: ({ formatMessage }) => [
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
    ],
  },
});

export default expandPlugin;
export { ExpandPluginState } from './types';
export { pluginKey } from './pm-plugins/main';
