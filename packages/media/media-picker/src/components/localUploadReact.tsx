import { Component } from 'react';
import { start, end } from 'perf-marks';
import { MediaClient } from '@atlaskit/media-client';
import { UploadService } from '../service/types';
import {
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadEventPayloadMap,
} from '../domain/uploadEvent';
import { UploadComponent } from './component';
import { UploadParams } from '../domain/config';
import { UploadServiceImpl } from '../service/uploadServiceImpl';
import { LocalUploadConfig } from './types';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import {
  TRACK_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
  GasPurePayload,
  GasCorePayload,
} from '@atlaskit/analytics-gas-types';
import { name as packageName } from '../version.json';
import { MediaFile } from '../domain/file';
import { ANALYTICS_MEDIA_CHANNEL } from './media-picker-analytics-error-boundary';

export type LocalUploadComponentBaseProps = {
  mediaClient: MediaClient;
  config: LocalUploadConfig;
  onUploadsStart?: (payload: UploadsStartEventPayload) => void;
  onPreviewUpdate?: (payload: UploadPreviewUpdateEventPayload) => void;
  onStatusUpdate?: (payload: UploadStatusUpdateEventPayload) => void;
  onProcessing?: (payload: UploadProcessingEventPayload) => void;
  onEnd?: (payload: UploadEndEventPayload) => void;
  onError?: (payload: UploadErrorEventPayload) => void;
} & WithAnalyticsEventsProps;

interface BasePayload {
  attributes: {
    packageName: string;
    fileAttributes: {
      fileSize: number;
      fileMimetype: string;
    };
  };
}

type AdditionalPayloadAttributes =
  | {}
  | {
      status: 'success' | 'fail';
      uploadDurationMsec: number;
      failReason?: any;
    };

type AnalyticsPayload = GasCorePayload &
  BasePayload &
  AdditionalPayloadAttributes & {
    action: 'commenced' | 'uploaded';
  };

const basePayload = (
  { size, type }: Pick<MediaFile, 'size' | 'type'>,
  additionalAttributes: AdditionalPayloadAttributes = {},
): GasPurePayload & BasePayload & AdditionalPayloadAttributes => ({
  actionSubject: 'mediaUpload',
  actionSubjectId: 'localMedia',
  attributes: {
    packageName,
    fileAttributes: {
      fileSize: size,
      fileMimetype: type,
    },
    ...additionalAttributes,
  },
});

export class LocalUploadComponentReact<
  Props extends LocalUploadComponentBaseProps,
  M extends UploadEventPayloadMap = UploadEventPayloadMap
> extends Component<Props, {}> {
  protected readonly uploadService: UploadService;
  protected uploadComponent = new UploadComponent();

  constructor(props: Props) {
    super(props);

    const {
      mediaClient,
      config,
      onUploadsStart,
      onPreviewUpdate,
      onStatusUpdate,
      onProcessing,
      onEnd,
      onError,
    } = this.props;
    const tenantUploadParams = config.uploadParams;
    const { shouldCopyFileToRecents = true } = config;

    this.uploadComponent.on('uploads-start', this.fireCommencedEvent);
    this.uploadComponent.on('upload-end', this.fireUploadSucceeded);
    this.uploadComponent.on('upload-error', this.fireUploadFailed);
    if (onUploadsStart) {
      this.uploadComponent.on('uploads-start', onUploadsStart!);
    }
    if (onPreviewUpdate) {
      this.uploadComponent.on('upload-preview-update', onPreviewUpdate!);
    }
    if (onStatusUpdate) {
      this.uploadComponent.on('upload-status-update', onStatusUpdate!);
    }
    if (onProcessing) {
      this.uploadComponent.on('upload-processing', onProcessing!);
    }
    if (onEnd) {
      this.uploadComponent.on('upload-end', onEnd!);
    }
    if (onError) {
      this.uploadComponent.on('upload-error', onError!);
    }

    this.uploadService = new UploadServiceImpl(
      mediaClient,
      tenantUploadParams,
      shouldCopyFileToRecents,
    );
    this.uploadService.on('files-added', this.onFilesAdded);
    this.uploadService.on('file-preview-update', this.onFilePreviewUpdate);
    this.uploadService.on('file-uploading', this.onFileUploading);
    this.uploadService.on('file-converting', this.onFileConverting);
    this.uploadService.on('file-converted', this.onFileConverted);
    this.uploadService.on('file-upload-error', this.onUploadError);
  }

  private fireCommencedEvent = (payload: UploadsStartEventPayload) => {
    payload.files.forEach(({ id, size, type }) => {
      start(`MediaPicker.fireUpload.${id}`);
      this.createAndFireAnalyticsEvent({
        ...basePayload({ size, type }),
        action: 'commenced',
        eventType: OPERATIONAL_EVENT_TYPE,
      });
    });
  };

  private fireUploadSucceeded = (payload: UploadEndEventPayload) => {
    const { size, type, id } = payload.file;

    const { duration = -1 } = end(`MediaPicker.fireUpload.${id}`);
    this.createAndFireAnalyticsEvent({
      ...basePayload(
        { size, type },
        {
          status: 'success',
          uploadDurationMsec: duration,
        },
      ),
      action: 'uploaded',
      eventType: TRACK_EVENT_TYPE,
    });
  };

  private fireUploadFailed = (payload: UploadErrorEventPayload) => {
    const { size, type, id } = payload.file;

    const { duration = -1 } = end(`MediaPicker.fireUpload.${id}`);
    this.createAndFireAnalyticsEvent({
      ...basePayload(
        { size, type },
        {
          status: 'fail',
          failReason: payload.error.description,
          uploadDurationMsec: duration,
        },
      ),
      action: 'uploaded',
      eventType: TRACK_EVENT_TYPE,
    });
  };

  private createAndFireAnalyticsEvent = (payload: AnalyticsPayload) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      createAnalyticsEvent(payload).fire(ANALYTICS_MEDIA_CHANNEL);
    }
  };

  public cancel = (uniqueIdentifier?: string): void => {
    this.uploadService.cancel(uniqueIdentifier);
  };

  public setUploadParams(uploadParams: UploadParams): void {
    this.uploadService.setUploadParams(uploadParams);
  }

  private onFilesAdded = ({ files }: UploadsStartEventPayload): void => {
    this.uploadComponent.emitUploadsStart(files);
  };

  private onFilePreviewUpdate = ({
    file,
    preview,
  }: UploadPreviewUpdateEventPayload): void => {
    this.uploadComponent.emitUploadPreviewUpdate(file, preview);
  };

  private onFileUploading = ({
    file,
    progress,
  }: UploadStatusUpdateEventPayload): void => {
    this.uploadComponent.emitUploadProgress(file, progress);
  };

  private onFileConverting = ({ file }: UploadProcessingEventPayload): void => {
    this.uploadComponent.emitUploadProcessing(file);
  };

  private onFileConverted = (payload: UploadEndEventPayload): void => {
    this.uploadComponent.emitUploadEnd(payload.file);
  };

  private onUploadError = ({ file, error }: UploadErrorEventPayload): void => {
    this.uploadComponent.emitUploadError(file, error);
  };
}
