import { EditorPlugin } from '../../../types/editor-plugin';

export interface EditorPresetProps {
  excludes?: Array<string>;
  experimental?: Array<string>;
}

export type PluginsPreset = Array<
  ((arg: any) => EditorPlugin) | [(arg: any) => EditorPlugin, object]
>;
