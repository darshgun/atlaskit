import { UploadParams } from '@atlaskit/media-picker/types';
import { MediaClientConfig } from '@atlaskit/media-core';
import { EmojiProvider } from '@atlaskit/emoji/types';
import { MentionProvider } from '@atlaskit/mention/types';
import { ExtensionProvider } from '../extensions';

export type ProviderHandler = (name: string, provider?: Promise<any>) => void;

// TODO [ED-8005]: add other known providers like autoFormatting, task and decision etc
export interface Providers {
  mediaProvider?: Promise<MediaProvider>;
  emojiProvider?: Promise<EmojiProvider>;
  mentionProvider?: Promise<MentionProvider>;
  extensionProvider?: Promise<ExtensionProvider>;
  [key: string]: Promise<any> | undefined;
}

export interface FeatureFlags {}

export type MediaProvider = {
  uploadParams?: UploadParams;

  /**
   * (optional) Used for creating new uploads and finalizing files.
   * NOTE: We currently don't accept MediaClientConfig, because we need config properties
   *       to initialize
   */
  uploadMediaClientConfig?: MediaClientConfig;

  /**
   * (optional) For any additional feature to be enabled
   */
  featureFlags?: FeatureFlags;

  /**
   * Used for displaying Media Cards and downloading files.
   */
  viewMediaClientConfig: MediaClientConfig;
};
