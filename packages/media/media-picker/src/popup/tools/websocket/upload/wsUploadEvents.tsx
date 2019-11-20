import { ImageMetadata } from '@atlaskit/media-client';
import { ServiceName } from '../../../domain';

export interface RemoteUploadBasePayload {
  uploadId: string;
  serviceName: ServiceName;
}
export interface RemoteUploadStartPayload extends RemoteUploadBasePayload {}

export interface RemoteUploadProgressPayload extends RemoteUploadBasePayload {
  bytes: number;
  fileSize: number;
}

export interface RemoteUploadEndPayload extends RemoteUploadBasePayload {
  fileId: string;
}

export interface RemoteUploadFailPayload extends RemoteUploadBasePayload {
  description: string;
}

export interface NotifyMetadataPayload extends RemoteUploadBasePayload {
  metadata: ImageMetadata;
}

export interface WsUploadEvents {
  RemoteUploadStart: RemoteUploadStartPayload;
  RemoteUploadProgress: RemoteUploadProgressPayload;
  RemoteUploadEnd: RemoteUploadEndPayload;
  NotifyMetadata: NotifyMetadataPayload;
  RemoteUploadFail: RemoteUploadFailPayload;
}

export type Handlers<T> = { [K in keyof T]: (payload: T[K]) => void };
export type WsUploadEventHandlers = Handlers<WsUploadEvents>;
