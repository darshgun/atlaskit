import * as MediaClientModule from '@atlaskit/media-client';
import { Auth } from '@atlaskit/media-core';
import {
  getFileStreamsCache,
  ProcessedFileState,
  ProcessingFileState,
  FileState,
} from '@atlaskit/media-client';
import {
  mockStore,
  expectFunctionToHaveBeenCalledWith,
  asMock,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';
import { resetView } from '../../../actions';
import finalizeUploadMiddleware, { finalizeUpload } from '../../finalizeUpload';
import {
  FinalizeUploadAction,
  FINALIZE_UPLOAD,
} from '../../../actions/finalizeUpload';
import { State } from '../../../domain';
import { ReplaySubject, Observable } from 'rxjs';

describe('finalizeUploadMiddleware', () => {
  const auth: Auth = {
    clientId: 'some-client-id',
    token: 'some-token',
    baseUrl: 'some-base-url',
  };
  const file = {
    id: 'some-file-id',
    name: 'some-file-name',
    type: 'some-file-type',
    creationDate: Date.now(),
    size: 12345,
  };
  const copiedFile = {
    ...file,
    id: 'some-copied-file-id',
  };
  const collection = 'some-collection';
  const uploadId = 'some-upload-id';
  const source = {
    id: file.id,
    collection,
  };
  const setup = (state: Partial<State> = {}) => {
    const store = mockStore(state);
    const { userMediaClient, tenantMediaClient } = store.getState();
    (userMediaClient.config.authProvider as jest.Mock<any>).mockReturnValue(
      Promise.resolve(auth),
    );

    jest
      .spyOn(MediaClientModule, 'MediaStore' as any)
      .mockImplementation(() => ({
        copyFileWithToken: () => Promise.resolve({ data: copiedFile }),
      }));

    return {
      store,
      next: jest.fn(),
      action: {
        type: FINALIZE_UPLOAD,
        file,
        uploadId,
        source,
      } as FinalizeUploadAction,
      tenantMediaClient,
    };
  };

  it('should do nothing given unknown action', () => {
    const { store, next } = setup();
    const action = {
      type: 'UNKNOWN',
    };

    finalizeUploadMiddleware()(store)(next)(action);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toBeCalledWith(action);
  });

  it('should send upload end event with metadata', async () => {
    const { store, action, tenantMediaClient } = setup();
    const processedFileState: ProcessedFileState = {
      ...copiedFile,
      artifacts: {},
      mediaType: 'image',
      mimeType: 'image/png',
      status: 'processed',
    };
    const fileStateObservable = new ReplaySubject(1);
    fileStateObservable.next(processedFileState);
    // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
    //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
    tenantMediaClient.file.getFileState = jest.fn(() => fileStateObservable);

    await finalizeUpload(store, action);
    expect(store.dispatch).toBeCalledWith(
      sendUploadEvent({
        event: {
          name: 'upload-end',
          data: {
            file,
          },
        },
        uploadId,
      }),
    );
  });

  it('should send upload processing event with metadata', () => {
    const { store, action, tenantMediaClient } = setup();
    const processingFileState: ProcessingFileState = {
      ...copiedFile,
      artifacts: {},
      mediaType: 'image',
      mimeType: 'image/png',
      status: 'processing',
    };
    const fileStateObservable = new ReplaySubject(1);
    fileStateObservable.next(processingFileState);
    // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
    //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
    tenantMediaClient.file.getFileState = jest.fn(() => fileStateObservable);

    return finalizeUpload(store, action).then(() => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-processing',
            data: {
              file,
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should send upload error event given some error happens', () => {
    const { store, action } = setup();
    const error = {
      message: 'some-error-message',
    };

    jest
      .spyOn(MediaClientModule, 'MediaStore' as any)
      .mockImplementation(() => ({
        copyFileWithToken: () => Promise.reject(error),
      }));

    return finalizeUpload(store, action).then(() => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-error',
            data: {
              file,
              error: {
                name: 'object_create_fail',
                description: error.message,
              },
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should call copyFileWithToken with the right params', async () => {
    const tenantMediaClient = fakeMediaClient();
    const { store, action } = setup({
      config: { uploadParams: { collection: 'some-tenant-collection' } },
      tenantMediaClient,
    });

    const copyFileWithToken = jest.fn().mockResolvedValue({
      data: { id: 'some-id' },
    }) as MediaClientModule.MediaStore['copyFileWithToken'];

    asMock(MediaClientModule.MediaStore).mockImplementation(() => ({
      copyFileWithToken,
    }));

    await finalizeUpload(store, action);

    expect(copyFileWithToken).toBeCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(copyFileWithToken, [
      {
        sourceFile: {
          collection: 'some-collection',
          id: 'some-file-id',
          owner: {
            id: 'some-client-id',
            token: 'some-token',
            baseUrl: 'some-base-url',
          },
        },
      },
      {
        collection: 'some-tenant-collection',
        occurrenceKey: undefined,
        replaceFileId: undefined,
      },
    ]);
  });

  it('should populate cache with processed state', async () => {
    const { store, action } = setup();
    const subject = new ReplaySubject<Partial<FileState>>(1);
    const next = jest.fn();
    subject.next({
      id: copiedFile.id,
    });
    getFileStreamsCache().set(copiedFile.id, subject as Observable<FileState>);

    await finalizeUpload(store, action);

    const observable = getFileStreamsCache().get(copiedFile.id);
    observable!.subscribe({ next });

    // Needed due usage of setTimeout in finalizeUpload
    await new Promise(resolve => setTimeout(resolve, 1));

    expect(next).toBeCalledWith({
      id: 'some-copied-file-id',
    });
  });

  it('should call reset view', async () => {
    const { store, action } = setup();

    await finalizeUpload(store, action);

    expect(store.dispatch).toHaveBeenCalledWith(resetView());
  });
});
