import * as React from 'react';

import { ProcessedFileState } from '@atlaskit/media-client';
import {
  awaitError,
  mountWithIntlContext,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';

import {
  ImageViewer,
  ImageViewerProps,
} from '../../../../../newgen/viewers/image';
import { BaseState } from '../../../../../newgen/viewers/base-viewer';
import { Content } from '../../../../../newgen/content';

const collectionName = 'some-collection';
const imageItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my image',
  size: 11222,
  mediaType: 'image',
  mimeType: 'jpeg',
  artifacts: {},
  representations: {
    image: {},
  },
};

function createFixture(response: Promise<Blob>, item = imageItem) {
  const mediaClient = fakeMediaClient();
  (mediaClient.getImage as jest.Mock).mockReturnValue(response);
  const onClose = jest.fn();
  const onLoaded = jest.fn();
  const el = mountWithIntlContext<ImageViewerProps, BaseState<Content>>(
    <ImageViewer
      mediaClient={mediaClient}
      item={item}
      collectionName={collectionName}
      onClose={onClose}
      onLoad={onLoaded}
    />,
  );
  return { mediaClient, el, onClose };
}

describe('ImageViewer', () => {
  it('assigns an object url for images when successful', async () => {
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;

    expect(el.state().content.data).toBeDefined();
  });

  it('should not update state when image fetch request is cancelled', async () => {
    const response = Promise.reject(new Error('request_cancelled'));
    const { el } = createFixture(response);

    const previousContent = el.state().content;
    expect(previousContent).toEqual({ state: { status: 'PENDING' } });

    await awaitError(response, 'request_cancelled');

    expect(el.state().content).toEqual(previousContent);
  });

  it('should not call `onLoad` callback when image fetch request is cancelled', async () => {
    const response = Promise.reject(new Error('request_cancelled'));
    const { el } = createFixture(response);

    expect(el.props().onLoad).not.toHaveBeenCalled();

    await awaitError(response, 'request_cancelled');

    expect(el.props().onLoad).not.toHaveBeenCalled();
  });

  it('cancels an image fetch request when unmounted', () => {
    const abort = jest.fn();
    class FakeAbortController {
      abort = abort;
    }
    (global as any).AbortController = FakeAbortController;
    const response: any = new Promise(() => {});
    const { el } = createFixture(response);

    el.unmount();

    expect(abort).toHaveBeenCalled();
  });

  it('revokes an existing object url when unmounted', async () => {
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    const revokeObjectUrl = jest.fn();
    (el as any).instance()['revokeObjectUrl'] = revokeObjectUrl;

    await response;
    el.unmount();

    expect(revokeObjectUrl).toHaveBeenCalled();
  });

  it('should call mediaClient.getImage when image representation is present and no preview is present', async () => {
    const response = Promise.resolve(new Blob());
    const { el, mediaClient } = createFixture(response);

    await response;
    el.update();

    expect(mediaClient.getImage).toHaveBeenCalledWith(
      'some-id',
      {
        collection: 'some-collection',
        mode: 'fit',
      },
      expect.anything(),
      true,
    );
  });

  it('should not call mediaClient.getImage when image representation and a preview is present', async () => {
    const response = Promise.resolve(new Blob());
    const { el, mediaClient } = createFixture(response, {
      ...imageItem,
      preview: { value: new Blob() },
    });

    await response;
    el.update();

    expect(mediaClient.getImage).not.toHaveBeenCalled();
  });

  it('should not call mediaClient.getImage when image representation is not present', async () => {
    const response = Promise.resolve(new Blob());
    const { el, mediaClient } = createFixture(response, {
      ...imageItem,
      representations: {},
    });

    await response;
    el.update();

    expect(mediaClient.getImage).not.toHaveBeenCalled();
  });

  it('MSW-700: clicking on background of ImageViewer does not close it', async () => {
    const response = Promise.resolve(new Blob());
    const { el, onClose } = createFixture(response);

    await response;
    el.simulate('click');

    expect(onClose).toHaveBeenCalled();
  });
});
