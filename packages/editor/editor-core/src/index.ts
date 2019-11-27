// Used in products integration code
export { name, version } from './version-wrapper';
export { clearEditorContent } from './commands';
export { default as Editor } from './editor';
export { default as EditorContext } from './ui/EditorContext';
export { default as WithEditorActions } from './ui/WithEditorActions';
export { default as WithHelpTrigger } from './ui/WithHelpTrigger';
export { default as CollapsedEditor } from './ui/CollapsedEditor';
export { default as ToolbarHelp } from './ui/ToolbarHelp';
export { default as ToolbarFeedback } from './ui/ToolbarFeedback';
export { EmojiResource } from '@atlaskit/emoji/resource';
export {
  default as mediaPlugin,
  insertMediaSingleNode,
  MediaOptions,
  MediaProvider,
  MediaState,
  CustomMediaPicker,
} from './plugins/media';
export { CollabEditProvider } from './plugins/collab-edit';
export {
  AbstractMentionResource,
  MentionProvider,
  MentionResource,
  PresenceProvider,
  PresenceResource,
} from '@atlaskit/mention/resource';
export { TeamMentionResource } from '@atlaskit/mention/team-resource';
export {
  AnnotationProvider,
  AnnotationComponentProps,
  AnnotationInfo,
} from './plugins/annotation';
export {
  QuickInsertProvider,
  QuickInsertItem,
} from './plugins/quick-insert/types';

// Used in mobile bridge
export { stateKey as mediaPluginKey } from './plugins/media/pm-plugins/main';
export { mentionPluginKey, MentionPluginState } from './plugins/mentions';
export {
  TextFormattingState,
  pluginKey as textFormattingStateKey,
} from './plugins/text-formatting/pm-plugins/main';
export { textColorPluginKey, TextColorPluginState } from './plugins/text-color';
export { changeColor } from './plugins/text-color/commands/change-color';
export { blockPluginStateKey, BlockTypeState } from './plugins';
export {
  HyperlinkState,
  InsertStatus as HyperlinkInsertStatus,
  stateKey as hyperlinkStateKey,
} from './plugins/hyperlink/pm-plugins/main';
export {
  ListsPluginState as ListsState,
  pluginKey as listsStateKey,
} from './plugins/lists/pm-plugins/main';
export {
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
  InputMethod as ListInputMethod,
} from './plugins/lists/commands';
export {
  InputMethodToolbar as TextFormattingInputMethodToolbar,
  InputMethodBasic as TextFormattingInputMethodBasic,
  toggleSuperscriptWithAnalytics,
  toggleSubscriptWithAnalytics,
  toggleStrikeWithAnalytics,
  toggleCodeWithAnalytics,
  toggleUnderlineWithAnalytics,
  toggleEmWithAnalytics,
  toggleStrongWithAnalytics,
} from './plugins/text-formatting/commands/text-formatting';
export {
  insertBlockType,
  insertBlockTypesWithAnalytics,
  setBlockType,
  setBlockTypeWithAnalytics,
  InputMethod as BlockTypeInputMethod,
} from './plugins/block-type/commands';
export { createTable } from './plugins/table/commands';
export { insertTaskDecisionWithAnalytics } from './plugins/tasks-and-decisions/commands';
export { TaskDecisionInputMethod } from './plugins/tasks-and-decisions/types';
export { EventDispatcher } from './event-dispatcher';
export {
  pluginKey as statusPluginKey,
  StatusState,
  StatusType,
} from './plugins/status/plugin';
export {
  commitStatusPicker,
  setStatusPickerAt,
  updateStatusWithAnalytics,
} from './plugins/status/actions';
export { typeAheadPluginKey, TypeAheadPluginState } from './plugins/type-ahead';
export { TypeAheadItem } from './plugins/type-ahead/types';
export { selectItem } from './plugins/type-ahead/commands/select-item';
export {
  insertLinkWithAnalytics,
  isTextAtPos,
  isLinkAtPos,
  setLinkHref,
  setLinkText,
} from './plugins/hyperlink/commands';
export { LinkInputType as LinkInputMethod } from './plugins/hyperlink/ui/HyperlinkAddToolbar/HyperlinkAddToolbar';
export { historyPluginKey, HistoryPluginState } from './plugins/history';
export { setKeyboardHeight } from './plugins/mobile-scroll/commands';
export {
  INPUT_METHOD,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  AnalyticsEventPayload,
} from './plugins/analytics';
export { TOOLBAR_MENU_TYPE as InsertBlockInputMethodToolbar } from './plugins/insert-block/ui/ToolbarInsertBlock';

// Used in editor-test-helpers
export { setTextSelection } from './utils';
export { ReactEditorView } from './create-editor';
export { getDefaultPluginsList } from './create-editor/create-plugins-list';
export { Command, EditorPlugin, EditorProps, EditorInstance } from './types';
export { default as EditorActions } from './actions';
export { MacroProvider, MacroAttributes, ExtensionType } from './plugins/macro';
export { CardProvider } from './plugins/card';
export {
  PortalProvider,
  PortalProviderAPI,
  PortalRenderer,
} from './ui/PortalProvider';
export {
  GapCursorSelection,
  Side as GapCursorSide,
} from './plugins/gap-cursor';
