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
  tablesPlugin,
  codeBlockPlugin,
  panelPlugin,
  listsPlugin,
  textColorPlugin,
  extensionPlugin,
  rulePlugin,
  datePlugin,
  layoutPlugin,
  cardPlugin,
  statusPlugin,
  mediaPlugin,
  mentionsPlugin,
  emojiPlugin,
  tasksAndDecisionsPlugin,
  insertBlockPlugin,
  basePlugin,
  placeholderPlugin,
  editorDisabledPlugin,
  typeAheadPlugin,
  floatingToolbarPlugin,
  gapCursorPlugin,
  annotationPlugin,
} from '../../../plugins';
import { MentionProvider } from '@atlaskit/mention/resource';
import { MediaProvider, CustomMediaPicker } from '../../../plugins/media';
import { EmojiProvider } from '@atlaskit/emoji';
import {
  removeExcludes,
  enableExperimental,
  ExperimentalPluginMap,
} from './utils';

interface EditorPresetMobileProps {
  children?: React.ReactNode;
  placeholder?: string;
  mentionProvider?: Promise<MentionProvider>;
  emojiProvider?: Promise<EmojiProvider>;
  media?: {
    provider?: Promise<MediaProvider>;
    picker?: CustomMediaPicker;
  };
}

export function EditorPresetMobile({
  children,
  mentionProvider,
  emojiProvider,
  media,
  placeholder,
  excludes,
  experimental,
}: EditorPresetMobileProps & EditorPresetProps) {
  let plugins = [
    pastePlugin(),
    blockTypePlugin(),
    clearMarksOnChangeToEmptyDocumentPlugin(),
    hyperlinkPlugin(),
    textFormattingPlugin({}),
    widthPlugin(),
    tablesPlugin({
      tableOptions: { allowControls: false },
    }),
    codeBlockPlugin(),
    panelPlugin(),
    listsPlugin(),
    textColorPlugin(),
    extensionPlugin(),
    rulePlugin(),
    datePlugin(),
    layoutPlugin(),
    statusPlugin({ menuDisabled: false, useInlineWrapper: true }),
    tasksAndDecisionsPlugin(),
    insertBlockPlugin({}),
    placeholderPlugin({ placeholder }),
    editorDisabledPlugin(),
    typeAheadPlugin(),
    floatingToolbarPlugin(),
    gapCursorPlugin(),
    annotationPlugin(),
    cardPlugin(),
  ];

  if (mentionProvider) {
    plugins.push(
      mentionsPlugin({
        useInlineWrapper: true,
      }),
    );
  }

  if (emojiProvider) {
    plugins.push(
      emojiPlugin({
        useInlineWrapper: true,
      }),
    );
  }

  if (media) {
    plugins.push(
      mediaPlugin(
        {
          provider: media.provider,
          customMediaPicker: media.picker,
          allowMediaSingle: true,
        },
        {
          allowMarkingUploadsAsIncomplete: true,
        },
      ),
    );
  }

  const experimentalMap: ExperimentalPluginMap = new Map();
  plugins = removeExcludes(plugins, excludes);
  plugins = enableExperimental(plugins, experimental, experimentalMap);

  // Add plugins that cannot be excluded for this preset.
  plugins.push(
    unsupportedContentPlugin(),
    basePlugin({
      allowScrollGutter: () => document.body,
    }),
  );

  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
