import { Node } from 'prosemirror-model';
import { UploadParams } from '@atlaskit/media-picker/types';
import { MediaClientConfig } from '@atlaskit/media-core';
import { EmojiProvider } from '@atlaskit/emoji/types';
export {
  ExtensionParams,
  ExtensionHandler,
  UpdateExtension,
  Extension,
  ExtensionHandlers,
} from './extension-handler';

export interface Transformer<T> {
  encode(node: Node): T;
  parse(content: T): Node;
}

// TODO [ED-8005]: add other known providers like emoji, mention, etc
export interface Providers {
  mediaProvider?: Promise<MediaProvider>;
  emojiProvider?: Promise<EmojiProvider>;
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

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
  NO_ORDER = 'no_order',
}

export {
  CollabEditProvider,
  CollabEvent,
  CollabEventData,
  CollabEventConnectionData,
  CollabEventInitData,
  CollabParticipant,
  CollabeEventPresenceData,
  CollabEventRemoteData,
  CollabSendableSelection,
  CollabEventTelepointerData,
} from './collab';
