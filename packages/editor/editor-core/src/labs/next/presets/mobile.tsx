// #region Imports
import * as React from 'react';
import { EmojiProvider } from '@atlaskit/emoji';
import { MentionProvider } from '@atlaskit/mention/resource';
import { TaskDecisionProvider } from '@atlaskit/task-decision';

import {
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
  annotationPlugin,
  mobileScrollPlugin,
} from '../../../plugins';
import { MediaProvider, CustomMediaPicker } from '../../../plugins/media';
import { PresetProvider } from '../Editor';
import { EditorPresetProps } from './types';
import { useDefaultPreset } from './default';
import { addExcludesFromProviderFactory, getPluginsFromPreset } from './utils';
import { useProviderFactory } from '@atlaskit/editor-common/provider-factory';
// #endregion

interface EditorPresetMobileProps {
  children?: React.ReactNode;
  placeholder?: string;
  mentionProvider?: Promise<MentionProvider>;
  emojiProvider?: Promise<EmojiProvider>;
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
  media?: {
    provider?: Promise<MediaProvider>;
    picker?: CustomMediaPicker;
  };
}

export function useMobilePreset({
  mentionProvider,
  emojiProvider,
  media,
  placeholder,
}: EditorPresetMobileProps & EditorPresetProps) {
  const [preset] = useDefaultPreset();

  preset.push(
    [
      basePlugin,
      {
        allowScrollGutter: {
          getScrollElement: () => document.body,
          allowCustomScrollHandler: false,
        },
      },
    ],
    [tablesPlugin, { tableOptions: { allowControls: false } }],
    codeBlockPlugin,
    panelPlugin,
    listsPlugin,
    textColorPlugin,
    extensionPlugin,
    rulePlugin,
    datePlugin,
    layoutPlugin,
    [statusPlugin, { menuDisabled: false, useInlineWrapper: true }],
    tasksAndDecisionsPlugin,
    insertBlockPlugin,
    [placeholderPlugin, { placeholder }],
    annotationPlugin,
    cardPlugin,
    mobileScrollPlugin,
  );

  if (mentionProvider) {
    preset.push([mentionsPlugin, { useInlineWrapper: true }]);
  }

  if (emojiProvider) {
    preset.push([emojiPlugin, { useInlineWrapper: true }]);
  }

  if (media) {
    preset.push([
      mediaPlugin,
      {
        provider: media.provider,
        customMediaPicker: media.picker,
        allowMediaSingle: true,
      },
      // TODO: ED-7891 Align media plugin constructor with other plugins
      // { allowMarkingUploadsAsIncomplete: true },
    ]);
  }

  return [preset];
}

export function EditorPresetMobile(
  props: EditorPresetMobileProps & EditorPresetProps,
) {
  const { children, excludes, experimental } = props;
  const [preset] = useMobilePreset(props);
  const providerFactory = useProviderFactory();

  const plugins = getPluginsFromPreset(
    preset,
    addExcludesFromProviderFactory(providerFactory, excludes),
    experimental,
  );

  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
