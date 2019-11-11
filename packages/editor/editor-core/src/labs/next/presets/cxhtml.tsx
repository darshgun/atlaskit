// #region Imports
import * as React from 'react';
import { MentionProvider } from '@atlaskit/mention/resource';

import {
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
} from '../../../plugins';
import { MediaProvider } from '../../../plugins/media';
import { PresetProvider } from '../Editor';
import { EditorPresetProps } from './types';
import { useDefaultPreset } from './default';
import { getPluginsFromPreset } from './utils';
// #endregion

interface EditorPresetCXHTMLProps {
  children?: React.ReactNode;
  placeholder?: string;
  mentionProvider?: Promise<MentionProvider>;
  mediaProvider?: Promise<MediaProvider>;
}

export function useCXHTMLPreset({
  mentionProvider,
  mediaProvider,
  placeholder,
}: EditorPresetCXHTMLProps & EditorPresetProps) {
  const [preset] = useDefaultPreset();

  preset.push(
    [
      basePlugin,
      {
        allowInlineCursorTarget: true,
        allowScrollGutter: () =>
          document.querySelector('.fabric-editor-popup-scroll-parent'),
      },
    ],
    quickInsertPlugin,
    [tablesPlugin, { tableOptions: { advanced: true } }],
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
    [statusPlugin, { menuDisabled: false }],
    tasksAndDecisionsPlugin,
    insertBlockPlugin,
    [placeholderPlugin, { placeholder }],
  );

  if (mentionProvider) {
    preset.push(mentionsPlugin);
  }

  if (mediaProvider) {
    preset.push([
      mediaPlugin,
      {
        provider: mediaProvider,
        allowMediaSingle: true,
        allowMediaGroup: true,
        allowAnnotation: true,
        allowResizing: true,
      },
    ]);
  }

  return [preset];
}

export function EditorPresetCXHTML(
  props: EditorPresetCXHTMLProps & EditorPresetProps,
) {
  const { children, excludes, experimental } = props;
  const [preset] = useCXHTMLPreset(props);
  const plugins = getPluginsFromPreset(preset, excludes, experimental);

  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
