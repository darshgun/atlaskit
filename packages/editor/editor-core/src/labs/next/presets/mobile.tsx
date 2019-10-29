// #region Imports
import * as React from 'react';
import { EmojiProvider } from '@atlaskit/emoji';
import { MentionProvider } from '@atlaskit/mention/resource';

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
  iOSScrollPlugin,
} from '../../../plugins';
import { MediaProvider, CustomMediaPicker } from '../../../plugins/media';
import { PresetProvider } from '../Editor';
import { EditorPresetProps } from './types';
import { useDefaultPreset } from './default';
import { getPluginsFromPreset } from './utils';
// #endregion

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

export function useMobilePreset({
  mentionProvider,
  emojiProvider,
  media,
  placeholder,
}: EditorPresetMobileProps & EditorPresetProps) {
  const isIOS = !!(window as any).webkit;

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

  if (isIOS) {
    preset.push(iOSScrollPlugin);
  }

  return [preset];
}

export function EditorPresetMobile(
  props: EditorPresetMobileProps & EditorPresetProps,
) {
  const { children, excludes, experimental } = props;
  const [preset] = useMobilePreset(props);
  const plugins = getPluginsFromPreset(preset, excludes, experimental);

  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
