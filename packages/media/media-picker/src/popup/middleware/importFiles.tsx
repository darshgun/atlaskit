import uuid from 'uuid/v4';
import { Store, Dispatch, Middleware } from 'redux';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {
  TouchFileDescriptor,
  FileState,
  getFileStreamsCache,
  getMediaTypeFromMimeType,
  FilePreview,
  isPreviewableType,
  MediaType,
  globalMediaEventEmitter,
  observableToPromise,
  isErrorFileState,
} from '@atlaskit/media-client';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';

import { State, SelectedItem, LocalUpload, ServiceName } from '../domain';
import { isStartImportAction } from '../actions/startImport';
import { finalizeUpload } from '../actions/finalizeUpload';
import { remoteUploadStart } from '../actions/remoteUploadStart';
import { getPreview } from '../actions/getPreview';
import { handleCloudFetchingEvent } from '../actions/handleCloudFetchingEvent';
import { setEventProxy } from '../actions/setEventProxy';
import { hidePopup } from '../actions/hidePopup';
import { resetView } from '../actions/resetView';
import { WsProvider } from '../tools/websocket/wsProvider';
import { WsConnectionHolder } from '../tools/websocket/wsConnectionHolder';
import { RemoteUploadActivity } from '../tools/websocket/upload/remoteUploadActivity';
import { copyMediaFileForUpload } from '../../domain/file';
import { MediaFile } from '../../types';
import { PopupUploadEventEmitter } from '../../components/types';
import { sendUploadEvent } from '../actions/sendUploadEvent';
import { WsNotifyMetadata } from '../tools/websocket/wsMessageData';
import { getPreviewFromMetadata } from '../../domain/preview';

export interface RemoteFileItem extends SelectedItem {
  accountId: string;
  publicId: string;
}

export const isRemoteFileItem = (
  item: SelectedItem,
): item is RemoteFileItem => {
  return ['dropbox', 'google', 'giphy'].indexOf(item.serviceName) !== -1;
};

export const isRemoteService = (serviceName: ServiceName) => {
  return ['dropbox', 'google', 'giphy'].indexOf(serviceName) !== -1;
};

export type SelectedUploadFile = {
  readonly file: MediaFile;
  readonly serviceName: ServiceName;
  readonly touchFileDescriptor: TouchFileDescriptor;
  readonly accountId?: string;
};

const mapSelectedItemToSelectedUploadFile = (
  {
    id,
    name,
    mimeType,
    size,
    date,
    serviceName,
    accountId,
    occurrenceKey = uuid(),
  }: SelectedItem,
  tenantFileId: string,
  collection?: string,
): SelectedUploadFile => ({
  file: {
    id,
    name,
    size,
    creationDate: date || Date.now(),
    type: mimeType,
    occurrenceKey,
  },
  serviceName,
  accountId,
  touchFileDescriptor: {
    fileId: tenantFileId,
    occurrenceKey,
    collection,
  },
});

export function importFilesMiddleware(
  eventEmitter: PopupUploadEventEmitter,
  wsProvider: WsProvider,
): Middleware {
  return store => (next: Dispatch<State>) => (action: any) => {
    if (isStartImportAction(action)) {
      importFiles(eventEmitter, store as any, wsProvider);
    }
    return next(action);
  };
}

const getPreviewByService = (
  store: Store<State>,
  serviceName: ServiceName,
  mediaType: MediaType,
  fileId: string,
) => {
  const { userMediaClient, giphy } = store.getState();

  if (serviceName === 'giphy') {
    const selectedGiphy = giphy.imageCardModels.find(
      cardModel => cardModel.metadata.id === fileId,
    );
    if (selectedGiphy) {
      return {
        value: selectedGiphy.dataURI,
      };
    }
  } else if (serviceName === 'upload') {
    const observable = getFileStreamsCache().get(fileId);
    if (observable) {
      return new Promise<FilePreview>(resolve => {
        const subscription = observable.subscribe({
          next(state) {
            if (state.status !== 'error') {
              setTimeout(() => subscription.unsubscribe(), 0);
              resolve(state.preview);
            }
          },
        });
      });
    }
  } else if (serviceName === 'recent_files' && isPreviewableType(mediaType)) {
    return new Promise<FilePreview>(async resolve => {
      // We fetch a good size image, since it can be opened later on in MV
      const blob = await userMediaClient.getImage(
        fileId,
        {
          collection: RECENTS_COLLECTION,
          mode: 'fit',
        },
        undefined,
        true,
      );

      resolve({ value: blob });
    });
  }

  return undefined;
};

/**
 * Take selected file (that can be local uploads, recents or remote file (giphy, google, dropbox))
 * and convert it to FileState that will become tenant file state.
 * If selected file already in the cache (for local uploads and recents) we take everything it has, change it's id
 * to new tenant id (generated on client side) and add a preview.
 * If selected file is not in the cache (for remote selected files) we generate new file state
 * with details found in selected file.
 */
export const getTenantFileState = async (
  store: Store<State>,
  selectedUploadFile: SelectedUploadFile,
): Promise<FileState> => {
  const {
    file: selectedUserFile,
    serviceName,
    touchFileDescriptor,
  } = selectedUploadFile;

  const tenantFileId = touchFileDescriptor.fileId;
  const selectedUserFileId = selectedUserFile.id;

  const mediaType = getMediaTypeFromMimeType(selectedUserFile.type);
  const preview = getPreviewByService(
    store,
    serviceName,
    mediaType,
    selectedUserFileId,
  );

  const userFileObservable = getFileStreamsCache().get(selectedUserFileId);
  if (userFileObservable) {
    // Even though there is await here we will wait mostly for 1 tick, since
    // observable.next inside observableToPromise will eval synchronously.
    const userFileState = await observableToPromise(userFileObservable);

    if (isErrorFileState(userFileState)) {
      return {
        ...userFileState,
        id: tenantFileId,
      };
    } else {
      return {
        ...userFileState,
        id: tenantFileId,
        preview,
      };
    }
  } else {
    return {
      id: tenantFileId,
      status: 'processing',
      mediaType,
      mimeType: selectedUserFile.type,
      name: selectedUserFile.name,
      size: selectedUserFile.size,
      preview,
      representations: {},
    };
  }
};

/**
 * Add tenant state to the cache and then emit this state to everyone who is listening on
 * 1. mediaClient even-emitter interface (mediaClient.on()).
 *  Note: There shouldn't be anyone listening here atm. This will be removed as soon as we remove Context API.
 * 2. globalMediaEventEmitter even-emitter interface.
 *  Note: This is different from `mediaPicker.on()` event-emitter interface!
 */
const distributeTenantFileState = async (
  store: Store<State>,
  tenantFileState: FileState,
  userSelectedFileId: string,
) => {
  const { tenantMediaClient } = store.getState();
  const tenantFileSubject = new ReplaySubject<FileState>(1);
  const userFileObservable = getFileStreamsCache().get(userSelectedFileId);

  getFileStreamsCache().set(tenantFileState.id, tenantFileSubject);
  tenantFileSubject.next(tenantFileState);
  if (userFileObservable) {
    userFileObservable.subscribe({
      next: latestUserFileState => {
        const previewOverride = !isErrorFileState(tenantFileState)
          ? { preview: tenantFileState.preview }
          : {};
        tenantFileSubject.next({
          ...latestUserFileState,
          ...previewOverride,
          id: tenantFileState.id,
        });
      },
    });
  }

  tenantMediaClient.emit('file-added', tenantFileState);
  globalMediaEventEmitter.emit('file-added', tenantFileState);
};

/**
 * We call `/upload/createWithFiles` (touch) endpoint to create an empty file with client side
 * generated file ID that we use here as tenant file id.
 */
export const touchSelectedFile = (
  touchFileDescriptor: TouchFileDescriptor,
  store: Store<State>,
) => {
  const { tenantMediaClient, config } = store.getState();
  const tenantCollection =
    config.uploadParams && config.uploadParams.collection;

  return tenantMediaClient.file.touchFiles(
    [touchFileDescriptor],
    tenantCollection,
  );
};

export async function importFiles(
  eventEmitter: PopupUploadEventEmitter,
  store: Store<State>,
  wsProvider: WsProvider,
): Promise<void> {
  const { uploads, selectedItems, userMediaClient, config } = store.getState();
  const tenantCollection =
    config.uploadParams && config.uploadParams.collection;
  store.dispatch(hidePopup());

  const userAuth = await userMediaClient.config.authProvider();

  const selectedUploadFiles = selectedItems.map(item => {
    const tenantFileId = uuid();
    return mapSelectedItemToSelectedUploadFile(
      item,
      tenantFileId,
      tenantCollection,
    );
  });

  await Promise.all(
    selectedUploadFiles.map(async selectedUploadFile => {
      // 1. We convert selectedUploadItems into tenant's fileState
      const tenantFileStates = await getTenantFileState(
        store,
        selectedUploadFile,
      );

      const userSelectedFileId = selectedUploadFile.file.id;

      // 2. We store them to the cache and notify all listeners of global event emitter
      distributeTenantFileState(store, tenantFileStates, userSelectedFileId);
    }),
  );

  // 3. We notify all listeners of mediaPicker event emitter about 'uploads-start' event
  eventEmitter.emitUploadsStart(
    selectedUploadFiles.map(({ file, touchFileDescriptor }) =>
      copyMediaFileForUpload(file, touchFileDescriptor.fileId),
    ),
  );

  // 4. Now, when empty file was created we can do all the necessary uploading/copy operations
  // TODO here we don't have actually guarantee that empty file was created.
  // https://product-fabric.atlassian.net/browse/MS-2165
  selectedUploadFiles.forEach(selectedUploadFile => {
    const { file, serviceName, touchFileDescriptor } = selectedUploadFile;
    const selectedItemId = file.id;
    if (serviceName === 'upload') {
      const localUpload: LocalUpload = uploads[selectedItemId];
      const { fileId } = touchFileDescriptor;
      importFilesFromLocalUpload(
        selectedUploadFile,
        fileId,
        store,
        localUpload,
        fileId,
      );
    } else if (serviceName === 'recent_files') {
      importFilesFromRecentFiles(selectedUploadFile, store);
    } else if (isRemoteService(serviceName)) {
      const wsConnectionHolder = wsProvider.getWsConnectionHolder(userAuth);

      importFilesFromRemoteService(
        selectedUploadFile,
        store,
        wsConnectionHolder,
      );
    }
  });

  store.dispatch(resetView());
}

export const importFilesFromLocalUpload = async (
  selectedUploadFile: SelectedUploadFile,
  uploadId: string,
  store: Store<State>,
  localUpload: LocalUpload,
  replaceFileId?: string,
): Promise<void> => {
  const {
    file: { id },
    touchFileDescriptor,
  } = selectedUploadFile;

  await touchSelectedFile(touchFileDescriptor, store);

  localUpload.events.forEach(originalEvent => {
    const event = { ...originalEvent };

    if (event.name === 'upload-processing') {
      const { file } = event.data;
      const source = {
        id: file.id,
        collection: RECENTS_COLLECTION,
      };

      store.dispatch(finalizeUpload(file, uploadId, source, replaceFileId));
    } else if (event.name !== 'upload-end') {
      store.dispatch(sendUploadEvent({ event, uploadId }));
    }
  });

  store.dispatch(setEventProxy(id, uploadId));
};

export const importFilesFromRecentFiles = async (
  selectedUploadFile: SelectedUploadFile,
  store: Store<State>,
): Promise<void> => {
  const { file, touchFileDescriptor } = selectedUploadFile;
  const { fileId } = touchFileDescriptor;
  const source = {
    id: file.id,
    collection: RECENTS_COLLECTION,
  };

  store.dispatch(getPreview(fileId, file, RECENTS_COLLECTION));
  await touchSelectedFile(touchFileDescriptor, store);
  store.dispatch(finalizeUpload(file, fileId, source, fileId));
};

export const importFilesFromRemoteService = async (
  selectedUploadFile: SelectedUploadFile,
  store: Store<State>,
  wsConnectionHolder: WsConnectionHolder,
): Promise<void> => {
  const {
    touchFileDescriptor,
    serviceName,
    accountId,
    file,
  } = selectedUploadFile;
  const { fileId } = touchFileDescriptor;

  await touchSelectedFile(touchFileDescriptor, store);

  const uploadActivity = new RemoteUploadActivity(fileId, (event, payload) => {
    if (event === 'NotifyMetadata') {
      const preview = getPreviewFromMetadata(
        (payload as WsNotifyMetadata).metadata,
      );

      store.dispatch(
        sendUploadEvent({
          event: {
            name: 'upload-preview-update',
            data: {
              file,
              preview,
            },
          },
          uploadId: fileId,
        }),
      );
    } else {
      // TODO figure out the difference between this uploadId and the last MSW-405
      const { uploadId: newUploadId } = payload;
      const newFile: MediaFile = {
        ...file,
        id: newUploadId,
        creationDate: Date.now(),
      };

      store.dispatch(handleCloudFetchingEvent(newFile, event, payload));
    }
  });

  uploadActivity.on('Started', () => {
    store.dispatch(remoteUploadStart(fileId));
  });

  wsConnectionHolder.openConnection(uploadActivity);

  wsConnectionHolder.send({
    type: 'fetchFile',
    params: {
      serviceName,
      accountId,
      fileId: file.id,
      fileName: file.name,
      collection: RECENTS_COLLECTION,
      jobId: fileId,
    },
  });
};
