jest.mock('uuid/v4', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockReturnValue('some-scope'),
}));

import {
  globalMediaEventEmitter,
  isErrorFileState,
  observableToPromise,
  getFileStreamsCache,
  FileState,
  RECENTS_COLLECTION,
} from '@atlaskit/media-client';
import { ReplaySubject } from 'rxjs';
const globalEmitSpy = jest.spyOn(globalMediaEventEmitter, 'emit');
import uuidV4 from 'uuid/v4';
import {
  mockStore,
  mockWsConnectionHolder,
  mockPopupUploadEventEmitter,
  nextTick,
  asMock,
  expectFunctionToHaveBeenCalledWith,
  expectToEqual,
} from '@atlaskit/media-test-helpers';
import { Action, Dispatch } from 'redux';

import {
  importFilesMiddleware,
  isRemoteService,
  importFiles,
  SelectedUploadFile,
  getTenantFileState,
  touchSelectedFiles,
} from '../../importFiles';
import { LocalUpload, LocalUploads } from '../../../domain';
import { finalizeUpload } from '../../../actions/finalizeUpload';
import { startImport } from '../../../actions/startImport';
import { resetView } from '../../../actions/resetView';
import {
  UploadEndEvent,
  UploadPreviewUpdateEvent,
  UploadProcessingEvent,
  UploadEventName,
} from '../../../../domain/uploadEvent';
import MockContext = jest.MockContext;
import {
  setEventProxy,
  SetEventProxyAction,
} from '../../../actions/setEventProxy';
import { getPreview } from '../../../actions/getPreview';
import { hidePopup } from '../../../actions/hidePopup';
import { MediaFile } from '../../../../domain/file';
import {
  isSendUploadEventAction,
  SendUploadEventAction,
  SendUploadEventActionPayload,
} from '../../../actions/sendUploadEvent';
import { SCALE_FACTOR_DEFAULT } from '../../../../util/getPreviewFromImage';

describe('importFiles middleware', () => {
  const expectUUID = expect.stringMatching(/[a-f0-9\-]+/);
  const todayDate = Date.now();
  interface SetupOptions {
    withSelectedItems: boolean;
  }
  const defaultOptions: SetupOptions = {
    withSelectedItems: true,
  };
  const makeFileData = (index: number) => ({
    id: `some-selected-item-id-${index}`,
    name: `picture${index}.jpg`,
    mimeType: 'image/jpg',
    size: 42 + index,
    occurrenceKey: `occurrence-key-${index}`,
  });

  const getSendUploadEventPayloads = (
    store: { dispatch: jest.Mock<unknown> },
    eventName: UploadEventName,
  ): SendUploadEventActionPayload[] => {
    return store.dispatch.mock.calls
      .map(args => args[0] as SendUploadEventAction)
      .filter(isSendUploadEventAction)
      .filter(({ payload: { event } }) => event.name === eventName)
      .map(({ payload }) => payload);
  };

  const getDispatchArgs = (store: any, type: string): Action[] =>
    (store.dispatch.mock as MockContext<Dispatch<any>>).calls
      .filter(args => args[0].type === type)
      .map(args => args[0]);

  const setup = (opts: Partial<SetupOptions> = {}) => {
    const { withSelectedItems } = {
      ...defaultOptions,
      ...opts,
    } as SetupOptions;

    const makeLocalUpload = (index: number): LocalUpload => {
      const { id, name, mimeType: type, size, occurrenceKey } = makeFileData(
        index,
      );

      const file = {
        id,
        name,
        type,
        size,
        creationDate: todayDate,
        occurrenceKey,
      };

      const fileWithPublicId = { ...file, publicId: `publicId-${index}` };
      const uploadProcessingEvent: UploadProcessingEvent = {
        name: 'upload-processing',
        data: {
          file: fileWithPublicId,
        },
      };

      const uploadPreviewUpdateEvent: UploadPreviewUpdateEvent = {
        name: 'upload-preview-update',
        data: {
          file,
          preview: {
            dimensions: {
              width: 10,
              height: 10,
            },
            scaleFactor: SCALE_FACTOR_DEFAULT,
          },
        },
      };

      const uploadEndEvent: UploadEndEvent = {
        name: 'upload-end',
        data: {
          file,
        },
      };

      return {
        file: {
          metadata: {
            ...makeFileData(index),
          },
        },
        events: [
          // uploads-event won't be part of events list. See fileUploadsAdd.tsx
          uploadPreviewUpdateEvent,
          uploadProcessingEvent,
          uploadEndEvent,
        ],
        index,
        progress: null,
        timeStarted: 0,
      };
    };

    const localUploads: LocalUploads = {
      'some-selected-item-id-1': makeLocalUpload(1),
      'some-selected-item-id-2': makeLocalUpload(2),
      'some-selected-item-id-3': makeLocalUpload(3),
    };

    // We fill in cache with local upload states as it would be in real world
    Object.keys(localUploads).forEach(key => {
      const { id, mimeType, name, size } = localUploads[key].file.metadata;
      const userFileStateSubject = new ReplaySubject<FileState>(1);
      getFileStreamsCache().set(id, userFileStateSubject);
      userFileStateSubject.next({
        id,
        mimeType,
        name,
        size,
        status: 'uploading',
        mediaType: 'image',
        progress: 0.5,
      });
    });

    const store = mockStore(
      withSelectedItems
        ? {
            uploads: localUploads,
            config: {
              uploadParams: {
                collection: 'tenant-collection',
              },
            },
            selectedItems: [
              {
                serviceName: 'upload',
                ...makeFileData(1),
                accountId: '',
                date: todayDate,
              },
              // Not all uploaded files are being selected. number 2 was skipped
              {
                serviceName: 'upload',
                ...makeFileData(3),
                accountId: '',
                date: todayDate,
              },
              {
                serviceName: 'recent_files',
                ...makeFileData(4),
                accountId: '',
                date: todayDate,
              },
              {
                serviceName: 'dropbox',
                ...makeFileData(5),
                accountId: 'some-account-id',
                date: 0,
              },
            ],
          }
        : {},
    );

    const wsConnectionHolder = mockWsConnectionHolder();
    const mockWsProvider = {
      getWsConnectionHolder: jest.fn(() => wsConnectionHolder),
    } as any;
    const nextDispatch = jest.fn();

    return {
      mockWsProvider,
      wsConnectionHolder,
      store,
      nextDispatch,
      eventEmitter: mockPopupUploadEventEmitter(),
    };
  };

  const importFilesMiddlewareAndAwait = async (
    setupResult: ReturnType<typeof setup>,
    action: Action = startImport(),
  ) => {
    const { eventEmitter, mockWsProvider, store, nextDispatch } = setupResult;
    importFilesMiddleware(eventEmitter, mockWsProvider)(store)(nextDispatch)(
      action,
    );

    await nextTick(); // wait for auth provider
    await nextTick(); // wait for first `await observableToPromise` in getTenantFileState()
    await nextTick(); // wait for second `await observableToPromise` in getTenantFileState()
  };

  let uuidCounter = 0;
  beforeEach(() => {
    asMock(uuidV4).mockImplementation(() => `some-uuid-${uuidCounter++}`);
  });

  afterEach(() => {
    uuidCounter = 0;
    jest.resetAllMocks();
    getFileStreamsCache().removeAll();
  });

  it('should call next dispatch if action is START_IMPORT', async () => {
    const setupResult = setup();
    const action = startImport();
    await importFilesMiddlewareAndAwait(setupResult, action);
    const { nextDispatch } = setupResult;

    expect(nextDispatch).toBeCalledWith(action);
  });

  it('should call next dispatch even if action is not START_IMPORT', async () => {
    const setupResult = setup();
    const action = resetView();
    await importFilesMiddlewareAndAwait(setupResult, action);
    const { nextDispatch } = setupResult;

    expect(nextDispatch).toBeCalledWith(action);
  });

  describe('when START_IMPORT action supplied', () => {
    it('should emit uploads-start event back to container for all selected items', async () => {
      const { eventEmitter, mockWsProvider, store } = setup();
      await importFiles(eventEmitter, store, mockWsProvider);

      expect(eventEmitter.emitUploadsStart).toBeCalledWith([
        {
          id: 'some-uuid-0',
          name: 'picture1.jpg',
          type: 'image/jpg',
          size: 43,
          creationDate: todayDate,

          occurrenceKey: 'occurrence-key-1',
        },
        {
          id: 'some-uuid-1',
          name: 'picture3.jpg',
          type: 'image/jpg',
          size: 45,
          creationDate: todayDate,

          occurrenceKey: 'occurrence-key-3',
        },
        {
          id: 'some-uuid-2',
          name: 'picture4.jpg',
          type: 'image/jpg',
          size: 46,
          creationDate: todayDate,

          occurrenceKey: 'occurrence-key-4',
        },
        {
          id: 'some-uuid-3',
          name: 'picture5.jpg',
          type: 'image/jpg',
          size: 47,
          creationDate: expect.any(Number),

          occurrenceKey: 'occurrence-key-5',
        },
      ]);
    });

    it('should add tenant file state to cache for all selected items', async () => {
      const { eventEmitter, mockWsProvider, store } = setup();
      await importFiles(eventEmitter, store, mockWsProvider);
      const tenantFileStateSubject = getFileStreamsCache().get('some-uuid-0');

      if (!tenantFileStateSubject) {
        return expect(tenantFileStateSubject).toBeDefined();
      }
      const tenantFileState1 = await observableToPromise(
        tenantFileStateSubject,
      );
      expectToEqual(tenantFileState1, {
        id: 'some-uuid-0',
        mediaType: 'image',
        mimeType: 'image/jpg',
        name: 'picture1.jpg',
        progress: 0.5,
        size: 43,
        status: 'uploading',
        preview: expect.any(Promise),
      });
      expect(getFileStreamsCache().get('some-uuid-1')).toBeDefined();
      expect(getFileStreamsCache().get('some-uuid-2')).toBeDefined();
      expect(getFileStreamsCache().get('some-uuid-3')).toBeDefined();
      return;
    });

    describe('while piping user file state to tenant file state', () => {
      let initialTenantFileState1: FileState;
      let newTenantFileState1: FileState;

      beforeEach(async () => {
        const { eventEmitter, mockWsProvider, store } = setup();
        await importFiles(eventEmitter, store, mockWsProvider);

        // Tenant file state stream
        const tenantFileStateSubject = getFileStreamsCache().get('some-uuid-0');
        if (!tenantFileStateSubject) {
          return expect(tenantFileStateSubject).toBeDefined();
        }

        // It's counterpart user file state stream
        const userFileStateSubject = getFileStreamsCache().get(
          'some-selected-item-id-1',
        ) as ReplaySubject<FileState>;
        if (!userFileStateSubject) {
          return expect(userFileStateSubject).toBeDefined();
        }

        // Get tenant file state before user file state pushed a change
        initialTenantFileState1 = await observableToPromise(
          tenantFileStateSubject,
        );

        // Get user file state
        const userFileState1 = await observableToPromise(userFileStateSubject);
        if (isErrorFileState(userFileState1)) {
          return expect(userFileState1.status).not.toBe('error');
        }

        // Push new file state (based on an old one) but with new details
        userFileStateSubject.next({
          ...userFileState1,
          preview: Promise.resolve({} as any),
          name: 'new name',
        });

        // Get latest tenant file state
        newTenantFileState1 = await observableToPromise(tenantFileStateSubject);
      });

      it('should pipe new data from user file state to tenant one', () => {
        if (isErrorFileState(newTenantFileState1)) {
          return expect(initialTenantFileState1.status).not.toBe('error');
        }
        expect(newTenantFileState1.name).toEqual('new name');
      });

      it('should keep existing tenant id (not overwrite with user one)', () => {
        expect(newTenantFileState1.id).toEqual(initialTenantFileState1.id);
      });

      it('should keep existing promise/object of a preview.', () => {
        if (isErrorFileState(newTenantFileState1)) {
          return expect(newTenantFileState1.status).not.toBe('error');
        }
        if (isErrorFileState(initialTenantFileState1)) {
          return expect(initialTenantFileState1.status).not.toBe('error');
        }
        expect(newTenantFileState1.preview).toBe(
          initialTenantFileState1.preview,
        );
      });
    });

    it('should close popup', async () => {
      const setupResult = setup();
      await importFilesMiddlewareAndAwait(setupResult);
      const { store } = setupResult;

      expect(store.dispatch).toHaveBeenCalledWith(hidePopup());
    });

    describe('each selected and recent file', () => {
      it('should dispatch GET_PREVIEW action', () => {
        const { eventEmitter, mockWsProvider, store } = setup();

        return importFiles(eventEmitter, store, mockWsProvider).then(() => {
          expect(store.dispatch).toBeCalledWith(
            getPreview(
              expectUUID,
              {
                id: 'some-selected-item-id-4',
                name: 'picture4.jpg',
                type: 'image/jpg',
                size: 46,
                creationDate: todayDate,
                occurrenceKey: 'occurrence-key-4',
              },
              RECENTS_COLLECTION,
            ),
          );
        });
      });
    });

    describe('each selected and locally uploaded file', () => {
      it('should dispatch FINALIZE_UPLOAD action', () => {
        const { eventEmitter, mockWsProvider, store } = setup();

        return importFiles(eventEmitter, store, mockWsProvider).then(() => {
          const localUploadsFinalizedNum = 2;
          const recentFinalizedNum = 1;
          const isFinalizeUploadCall = (call: Action[]) =>
            call[0].type === 'FINALIZE_UPLOAD';

          expect(
            store.dispatch.mock.calls.filter(isFinalizeUploadCall),
          ).toHaveLength(localUploadsFinalizedNum + recentFinalizedNum);

          expect(store.dispatch).toBeCalledWith(
            expect.objectContaining({
              file: expect.objectContaining({
                name: 'picture1.jpg',
              }),
            }),
          );

          expect(store.dispatch).toBeCalledWith(
            expect.objectContaining({
              file: expect.objectContaining({
                name: 'picture3.jpg',
              }),
            }),
          );

          expect(store.dispatch).toBeCalledWith(
            finalizeUpload(
              {
                id: 'some-selected-item-id-4',
                name: 'picture4.jpg',
                type: 'image/jpg',
                size: 46,
                creationDate: todayDate,
                occurrenceKey: 'occurrence-key-4',
              },
              expectUUID,
              {
                id: 'some-selected-item-id-4',
                collection: RECENTS_COLLECTION,
              },
              expect.anything(),
            ),
          );
        });
      });

      it('should bubble up some events', async () => {
        const setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
        const { store } = setupResult;

        const sendUploadEventsCalls = getSendUploadEventPayloads(
          store,
          'upload-preview-update',
        );

        expect(sendUploadEventsCalls).toHaveLength(2);
        let firstEvent = sendUploadEventsCalls[0]
          .event as UploadPreviewUpdateEvent;
        let secondEvent = sendUploadEventsCalls[1]
          .event as UploadPreviewUpdateEvent;
        expect(firstEvent.data.file.name).toEqual('picture1.jpg');
        expect(secondEvent.data.file.name).toEqual('picture3.jpg');
      });

      it('should not bubble up other events', async () => {
        const setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
        const { eventEmitter, store } = setupResult;

        expect(eventEmitter.emitUploadsStart).toHaveBeenCalledTimes(1);
        expect(getSendUploadEventPayloads(store, 'uploads-start')).toHaveLength(
          0,
        );
        expect(getSendUploadEventPayloads(store, 'upload-end')).toHaveLength(0);
      });

      it('should dispatch SET_EVENT_PROXY action', async () => {
        const setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
        const { store } = setupResult;

        const setEventProxyCalls = getDispatchArgs(
          store,
          'SET_EVENT_PROXY',
        ) as SetEventProxyAction[];
        expect(setEventProxyCalls).toHaveLength(2);
        expect(setEventProxyCalls[0]).toEqual(
          setEventProxy('some-selected-item-id-1', expectUUID),
        );
        expect(setEventProxyCalls[1]).toEqual(
          setEventProxy('some-selected-item-id-3', expectUUID),
        );
      });
    });

    describe('each selected and remote file', () => {
      it('should initiate the import with a websocket message', async () => {
        const setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
        const { wsConnectionHolder } = setupResult;

        expect(wsConnectionHolder.openConnection).toHaveBeenCalledTimes(1);
        expect(wsConnectionHolder.send).toHaveBeenCalledTimes(1);
        expect(wsConnectionHolder.send).toHaveBeenCalledWith({
          type: 'fetchFile',
          params: {
            serviceName: 'dropbox',
            accountId: 'some-account-id',
            fileId: 'some-selected-item-id-5',
            fileName: 'picture5.jpg',
            collection: RECENTS_COLLECTION,
            jobId: expectUUID,
          },
        });
      });

      it('should touch all files to import', async () => {
        const setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
        const { store } = setupResult;

        const { tenantMediaClient } = store.getState();
        expect(tenantMediaClient.file.touchFiles).toBeCalledTimes(1);
        expect(tenantMediaClient.file.touchFiles).toBeCalledWith(
          [
            {
              collection: 'tenant-collection',
              fileId: expectUUID,
              occurrenceKey: 'occurrence-key-1',
            },
            {
              collection: 'tenant-collection',
              fileId: expectUUID,
              occurrenceKey: 'occurrence-key-3',
            },
            {
              collection: 'tenant-collection',
              fileId: expectUUID,
              occurrenceKey: 'occurrence-key-4',
            },
            {
              collection: 'tenant-collection',
              fileId: expectUUID,
              occurrenceKey: 'occurrence-key-5',
            },
          ],
          'tenant-collection',
        );
      });
    });

    it('should emit file-added in tenant mediaClient and globalMediaEventEmitter', async () => {
      const setupResult = setup();
      await importFilesMiddlewareAndAwait(setupResult);
      const { store } = setupResult;

      const { tenantMediaClient } = store.getState();
      const fileState = {
        id: expectUUID,
        mediaType: 'image',
        mimeType: 'image/jpg',
        name: 'picture5.jpg',
        preview: undefined,
        representations: {},
        size: 47,
        status: 'processing',
      };

      expect(globalEmitSpy).toBeCalledTimes(4);
      expect(tenantMediaClient.emit).toBeCalledTimes(4);

      const globalEmitSpyCall = globalEmitSpy.mock.calls.find(
        call => call[1].name === fileState.name,
      );
      expect(globalEmitSpyCall).toEqual(['file-added', fileState]);

      const tenantMediaClientEmitCall = asMock(
        tenantMediaClient.emit,
      ).mock.calls.find(call => call[1].name === fileState.name);
      expect(tenantMediaClientEmitCall).toEqual(['file-added', fileState]);
    });

    it('should not modify client file state', async () => {
      const setupResult = setup();
      // We take client state from client observable, create new tenant state with all the client data,
      // but with extra preview and new tenant id and put that under tenant file id into the cache.
      await importFilesMiddlewareAndAwait(setupResult);

      // Now we get that tenant observable and just push it again (.next below)
      const tenantFileSateSubject = getFileStreamsCache().get(
        'some-uuid-0',
      ) as ReplaySubject<FileState>;
      if (!tenantFileSateSubject) {
        return expect(tenantFileSateSubject).toBeDefined();
      }
      const tenantFileSate = await observableToPromise(tenantFileSateSubject);
      tenantFileSateSubject.next(tenantFileSate);

      // Now we read client observable again from the cache
      const userFileStateSubject = getFileStreamsCache().get(
        'some-selected-item-id-1',
      );
      if (!userFileStateSubject) {
        return expect(userFileStateSubject).toBeDefined();
      }
      const userFileState = await observableToPromise(userFileStateSubject);

      // We are verifying that actions above didn't meddle with it's ID.
      expect(userFileState.id).toBe('some-selected-item-id-1');
      return;
    });
  });

  describe('isRemoteService', () => {
    it('should return true for service name "dropbox"', () => {
      expect(isRemoteService('dropbox')).toEqual(true);
    });

    it('should return true for service name "google"', () => {
      expect(isRemoteService('google')).toEqual(true);
    });

    it('should return false for service name other than "dropbox" or "google"', () => {
      expect(isRemoteService('recent_files')).toEqual(false);
    });
  });

  describe('getTenantFileState()', () => {
    const file: MediaFile = {
      id: 'user-id-1',
      creationDate: 1,
      name: '',
      size: 1,
      type: 'image/png',
    };

    it('should add file preview for Giphy files', async () => {
      const selectedFile: SelectedUploadFile = {
        file,
        serviceName: 'giphy',
        touchFileDescriptor: {
          fileId: 'id-1',
        },
      };

      const store = mockStore({
        giphy: {
          imageCardModels: [
            {
              dataURI: 'giphy-preview-1',
              dimensions: { height: 1, width: 1 },
              metadata: {
                id: 'user-id-1',
              },
            },
            {
              dataURI: 'giphy-preview-2',
              dimensions: { height: 1, width: 1 },
              metadata: {
                id: 'user-id-2',
              },
            },
          ],
        },
      });
      const fileState = await getTenantFileState(store, selectedFile);
      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }
      expect(fileState.preview).toEqual({
        value: 'giphy-preview-1',
      });
      return;
    });

    it('should add file preview for local uploads', async () => {
      const subject = new ReplaySubject<FileState>(1);
      subject.next({
        id: 'user-id-1',
        status: 'processing',
        name: 'some-name',
        size: 42,
        mediaType: 'audio',
        mimeType: 'some-type',
        preview: {
          value: 'some-local-preview',
        },
      });
      getFileStreamsCache().set('user-id-1', subject);
      const selectedFile: SelectedUploadFile = {
        file,
        serviceName: 'upload',
        touchFileDescriptor: {
          fileId: 'id-1',
        },
      };
      const store = mockStore();
      const fileState = await getTenantFileState(store, selectedFile);

      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }

      expect(await fileState.preview).toEqual({
        value: 'some-local-preview',
      });
      return;
    });

    it('should fetch remote preview for recent files if image is previewable', async () => {
      const selectedFile: SelectedUploadFile = {
        file,
        serviceName: 'recent_files',
        touchFileDescriptor: {
          fileId: 'id-1',
        },
      };
      const store = mockStore();

      const fileState = await getTenantFileState(store, selectedFile);

      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }

      await fileState.preview;
      const { userMediaClient } = store.getState();
      expect(userMediaClient.getImage).toBeCalledTimes(1);
      expect(userMediaClient.getImage).toBeCalledWith(
        'user-id-1',
        {
          collection: RECENTS_COLLECTION,
          mode: 'fit',
        },
        undefined,
        true,
      );
      return;
    });

    it('should set value of public file id to be new file state', async () => {
      const selectedFile: SelectedUploadFile = {
        file,
        serviceName: 'upload',
        touchFileDescriptor: {
          fileId: 'id-foo-1',
        },
      };

      const store = mockStore();

      const fileState = await getTenantFileState(store, selectedFile);

      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }

      expect(await fileState.id).toBe('id-foo-1');
      return;
    });

    it('should reuse existing user file state for tenant id', async () => {
      const userFile: MediaFile = {
        id: 'user-id',
        creationDate: 1,
        name: 'some_file_name',
        size: 1,
        type: 'image/png',
      };
      const selectedFile: SelectedUploadFile = {
        file: userFile,
        serviceName: 'upload',
        touchFileDescriptor: {
          fileId: 'tenant-upfront-id',
        },
      };

      const subject = new ReplaySubject<FileState>(1);
      subject.next({
        id: 'user-id',
        status: 'uploading',
        name: 'some_file_name',
        progress: 0.5,
        size: 42,
        mediaType: 'video',
        mimeType: 'some-type',
        preview: {
          value: 'some-existing-preview',
        },
      });
      getFileStreamsCache().set('user-id', subject);

      const store = mockStore();
      const fileState = await getTenantFileState(store, selectedFile);

      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }
      if (fileState.status !== 'uploading') {
        return expect(fileState.status).toBe('uploading');
      }

      expect(fileState.name).toEqual('some_file_name');
      expect(fileState.progress).toEqual(0.5);
      expect(fileState.mediaType).toEqual('video');
      expect(await fileState.preview).toEqual({
        value: 'some-existing-preview',
      });

      return;
    });
  });

  describe('touchSelectedFiles()', () => {
    const file: MediaFile = {
      id: 'id-1',
      creationDate: 1,
      name: '',
      size: 1,
      type: 'image/png',
    };

    it('should call touch endpoint', async () => {
      const selectedFiles: SelectedUploadFile[] = [
        {
          file,
          serviceName: 'upload',
          touchFileDescriptor: {
            fileId: 'tenant-upfront-id',
          },
        },
        {
          file,
          serviceName: 'upload',
          touchFileDescriptor: {
            fileId: 'tenant-upfront-id-2',
          },
        },
      ];
      const store = mockStore({
        config: { uploadParams: { collection: 'some-collection-name' } },
      });
      const { tenantMediaClient } = store.getState();
      await touchSelectedFiles(selectedFiles, store);
      expectFunctionToHaveBeenCalledWith(tenantMediaClient.file.touchFiles, [
        [
          {
            fileId: 'tenant-upfront-id',
          },
          {
            fileId: 'tenant-upfront-id-2',
          },
        ],
        'some-collection-name',
      ]);
    });

    it('should not call touchFiles if selected files are empty', async () => {
      const selectedFiles: SelectedUploadFile[] = [];
      const store = mockStore();
      const { tenantMediaClient } = store.getState();
      await touchSelectedFiles(selectedFiles, store);
      expect(tenantMediaClient.file.touchFiles).not.toHaveBeenCalled();
    });
  });
});
