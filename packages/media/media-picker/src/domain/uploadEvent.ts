import { UploadEventPayloadMap } from '../types';

export type UploadEventMap = {
  readonly [K in keyof UploadEventPayloadMap]: {
    readonly name: K;
    readonly data: UploadEventPayloadMap[K];
  };
};

export type UploadEventName = keyof UploadEventMap;
export type UploadEvent = UploadEventMap[UploadEventName];

export type UploadsStartEvent = UploadEventMap['uploads-start'];
export type UploadPreviewUpdateEvent = UploadEventMap['upload-preview-update'];
export type UploadStatusUpdateEvent = UploadEventMap['upload-status-update'];
export type UploadProcessingEvent = UploadEventMap['upload-processing'];
export type UploadEndEvent = UploadEventMap['upload-end'];
export type UploadErrorEvent = UploadEventMap['upload-error'];
