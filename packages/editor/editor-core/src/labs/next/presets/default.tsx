// #region Imports
import * as React from 'react';
import {
  pastePlugin,
  blockTypePlugin,
  clearMarksOnChangeToEmptyDocumentPlugin,
  hyperlinkPlugin,
  textFormattingPlugin,
  widthPlugin,
  unsupportedContentPlugin,
  basePlugin,
  editorDisabledPlugin,
  typeAheadPlugin,
  gapCursorPlugin,
  submitEditorPlugin,
  fakeTextCursorPlugin,
  sharedContextPlugin,
  floatingToolbarPlugin,
} from '../../../plugins';
import { PresetProvider } from '../Editor';
import { EditorPresetProps, PluginsPreset } from './types';
import { getPluginsFromPreset } from './utils';
// #endregion

interface EditorPresetDefaultProps {
  children?: React.ReactNode;
}

export function useDefaultPreset() {
  const preset: PluginsPreset = [
    pastePlugin,
    basePlugin,
    blockTypePlugin,
    clearMarksOnChangeToEmptyDocumentPlugin,
    hyperlinkPlugin,
    textFormattingPlugin,
    widthPlugin,
    typeAheadPlugin,
    unsupportedContentPlugin,
    editorDisabledPlugin,
    gapCursorPlugin,
    submitEditorPlugin,
    fakeTextCursorPlugin,
    sharedContextPlugin,
    floatingToolbarPlugin,
  ];

  return [preset];
}

export function EditorPresetCXHTML(
  props: EditorPresetDefaultProps & EditorPresetProps,
) {
  const [preset] = useDefaultPreset();
  const plugins = getPluginsFromPreset(preset);

  return <PresetProvider value={plugins}>{props.children}</PresetProvider>;
}
