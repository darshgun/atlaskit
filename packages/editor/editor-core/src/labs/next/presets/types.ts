import { EditorPlugin } from '../../../types/editor-plugin';
import ProviderFactory from '@atlaskit/editor-common/src/providerFactory';

export interface EditorPresetProps {
  excludes?: Array<string>;
  experimental?: Array<string>;
  providerFactory?: ProviderFactory;
}

export type PluginsPreset = Array<
  ((arg: any) => EditorPlugin) | [(arg: any) => EditorPlugin, object]
>;
