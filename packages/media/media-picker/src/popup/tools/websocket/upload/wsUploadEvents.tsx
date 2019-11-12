import { ImageMetadata } from '@atlaskit/media-client';
import { ServiceName } from '../../../domain';
export interface RemoteUploadStartPayload {
  uploadId: string;
  serviceName: ServiceName;
}

export interface RemoteUploadProgressPayload {
  uploadId: string;
  bytes: number;
  fileSize: number;
  serviceName: ServiceName;
}

export interface RemoteUploadEndPayload {
  fileId: string;
  uploadId: string;
  serviceName: ServiceName;
}

export interface RemoteUploadFailPayload {
  uploadId: string;
  description: string;
  serviceName: ServiceName;
}

export interface NotifyMetadataPayload {
  uploadId: string;
  serviceName: ServiceName;
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
