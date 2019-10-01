import * as React from 'react';
import { EditorPresetProps } from './types';
import { PresetProvider } from '../Editor';
import {
  pastePlugin,
  blockTypePlugin,
  clearMarksOnChangeToEmptyDocumentPlugin,
  hyperlinkPlugin,
  textFormattingPlugin,
  widthPlugin,
  unsupportedContentPlugin,
  quickInsertPlugin,
  tablesPlugin,
  codeBlockPlugin,
  panelPlugin,
  listsPlugin,
  textColorPlugin,
  breakoutPlugin,
  jiraIssuePlugin,
  extensionPlugin,
  rulePlugin,
  datePlugin,
  layoutPlugin,
  indentationPlugin,
  cardPlugin,
  statusPlugin,
  mediaPlugin,
  mentionsPlugin,
  tasksAndDecisionsPlugin,
  insertBlockPlugin,
  basePlugin,
  placeholderPlugin,
  editorDisabledPlugin,
  typeAheadPlugin,
  floatingToolbarPlugin,
  gapCursorPlugin,
} from '../../../plugins';
import { MentionProvider } from '@atlaskit/mention/resource';
import { MediaProvider } from '../../../plugins/media';
import {
  removeExcludes,
  enableExperimental,
  ExperimentalPluginMap,
} from './utils';

interface EditorPresetCXHTMLProps {
  children?: React.ReactNode;
  placeholder?: string;
  mentionProvider?: Promise<MentionProvider>;
  mediaProvider?: Promise<MediaProvider>;
}

export function EditorPresetCXHTML({
  children,
  mentionProvider,
  mediaProvider,
  placeholder,
  excludes,
  experimental,
}: EditorPresetCXHTMLProps & EditorPresetProps) {
  let plugins = [
    pastePlugin(),
    blockTypePlugin(),
    clearMarksOnChangeToEmptyDocumentPlugin(),
    hyperlinkPlugin(),
    textFormattingPlugin({}),
    widthPlugin(),
    quickInsertPlugin(),
    tablesPlugin({
      tableOptions: { advanced: true },
    }),
    codeBlockPlugin(),
    panelPlugin(),
    listsPlugin(),
    textColorPlugin(),
    breakoutPlugin(),
    jiraIssuePlugin(),
    extensionPlugin(),
    rulePlugin(),
    datePlugin(),
    layoutPlugin(),
    indentationPlugin(),
    cardPlugin(),
    statusPlugin({ menuDisabled: false }),
    tasksAndDecisionsPlugin(),
    insertBlockPlugin({}),
    placeholderPlugin({ placeholder }),
    editorDisabledPlugin(),
    typeAheadPlugin(),
    floatingToolbarPlugin(),
    gapCursorPlugin(),
  ];

  if (mentionProvider) {
    plugins.push(mentionsPlugin());
  }

  if (mediaProvider) {
    plugins.push(
      mediaPlugin({
        provider: mediaProvider,
        allowMediaSingle: true,
        allowMediaGroup: true,
        allowAnnotation: true,
        allowResizing: true,
      }),
    );
  }

  const experimentalMap: ExperimentalPluginMap = new Map();
  plugins = removeExcludes(plugins, excludes);
  plugins = enableExperimental(plugins, experimental, experimentalMap);

  // Add plugins that cannot be excluded for this preset.
  plugins.push(
    unsupportedContentPlugin(),
    basePlugin({
      allowInlineCursorTarget: true,
      allowScrollGutter: () =>
        document.querySelector('.fabric-editor-popup-scroll-parent'),
    }),
  );

  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
