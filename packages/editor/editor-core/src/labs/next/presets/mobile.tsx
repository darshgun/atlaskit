// #region Imports
import * as React from 'react';

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
  annotationPlugin,
  placeholderPlugin,
  mobileScrollPlugin,
} from '../../../plugins';
import { CustomMediaPicker, MediaProvider } from '../../../plugins/media';
import { PresetProvider } from '../Editor';
import { EditorPresetProps } from './types';
import { useDefaultPreset } from './default';
import { addExcludesFromProviderFactory, getPluginsFromPreset } from './utils';
import { useProviderFactory, useProvider } from '@atlaskit/editor-common/provider-factory';

// #endregion

interface EditorPresetMobileProps {
  children?: React.ReactNode;
  placeholder?: string;
  media?: {
    picker?: CustomMediaPicker;
  };
}

export function useMobilePreset({
  media,
  placeholder,
}: EditorPresetMobileProps & EditorPresetProps) {
  const mediaProvider = useProvider<Promise<MediaProvider>>('mediaProvider');
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
    // Begin -> This would be exclude if the provider doesnt exist in the factory
    [mentionsPlugin, { useInlineWrapper: true }],
    [emojiPlugin, { useInlineWrapper: true }],
    // End
  );

  if (media) {
    preset.push([
      mediaPlugin,
      {
        provider: mediaProvider,
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
