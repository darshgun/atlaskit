import { EventEmitter2 } from 'eventemitter2';
import { WsActivity, WsActivityEvents } from '../wsActivity';
import { WsUploadEvents, RemoteUploadBasePayload } from './wsUploadEvents';
import {
  WsUploadMessageData,
  isRemoteUploadStartData,
  isRemoteUploadProgressData,
  isRemoteUploadEndData,
  isRemoteUploadErrorData,
  isNotifyMetadata,
} from '../wsMessageData';
import { ServiceName } from '../../../domain';

export type DispatchUploadEvent<T extends keyof WsUploadEvents> = (
  event: T,
  payload: WsUploadEvents[T],
) => void;

export class RemoteUploadActivity implements WsActivity {
  private readonly eventEmitter = new EventEmitter2();

  constructor(
    private readonly uploadId: string,
    private readonly serviceName: ServiceName,
    private readonly dispatchEvent: DispatchUploadEvent<keyof WsUploadEvents>,
  ) {}

  processWebSocketData(data: WsUploadMessageData): void {
    if (!this.shouldProcessWsData(data)) {
      return;
    }

    const basePayload: RemoteUploadBasePayload = {
      // First try to use alternative response shape
      // Will be removed after backend unifies response schema
      uploadId: (data.data && data.data.uploadId) || data.uploadId,
      serviceName: this.serviceName,
    };

    if (isRemoteUploadStartData(data)) {
      this.dispatchEvent('RemoteUploadStart', {
        ...basePayload,
      });
      this.notifyActivityStarted();
    } else if (isRemoteUploadProgressData(data)) {
      this.dispatchEvent('RemoteUploadProgress', {
        bytes: data.currentAmount,
        fileSize: data.totalAmount,
        ...basePayload,
      });
    } else if (isRemoteUploadEndData(data)) {
      this.dispatchEvent('RemoteUploadEnd', {
        fileId: data.fileId,
        ...basePayload,
      });
      this.notifyActivityCompleted();
    } else if (isRemoteUploadErrorData(data)) {
      this.dispatchEvent('RemoteUploadFail', {
        description: (data.data && data.data.reason) || data.reason,
        ...basePayload,
      });
      this.notifyActivityCompleted();
    } else if (isNotifyMetadata(data)) {
      this.dispatchEvent('NotifyMetadata', {
        metadata: data.metadata,
        ...basePayload,
      });
    }
  }

  connectionLost(): void {
    if (this.uploadId) {
      this.dispatchEvent('RemoteUploadFail', {
        uploadId: this.uploadId,
        description: 'Websocket connection lost',
        serviceName: this.serviceName,
      });
    }
  }

  on<T extends keyof WsActivityEvents>(
    event: T,
    handler: WsActivityEvents[T],
  ): void {
    this.eventEmitter.on(event, handler);
  }

  off<T extends keyof WsActivityEvents>(
    event: T,
    handler: WsActivityEvents[T],
  ): void {
    this.eventEmitter.off(event, handler);
  }

  private shouldProcessWsData(data: WsUploadMessageData): boolean {
    const shouldProcess = !!(
      data.uploadId &&
      this.uploadId &&
      data.uploadId === this.uploadId
    );
    // Try to use alternative response shape
    // Will be removed after backend unifies response schema
    const shouldProcessAlt = !!(
      data.data &&
      data.data.uploadId &&
      this.uploadId &&
      data.data.uploadId === this.uploadId
    );

    return shouldProcess || shouldProcessAlt;
  }

  private notifyActivityStarted(): void {
    this.eventEmitter.emit('Started', this);
  }

  private notifyActivityCompleted(): void {
    this.eventEmitter.emit('Completed', this);
  }
}
