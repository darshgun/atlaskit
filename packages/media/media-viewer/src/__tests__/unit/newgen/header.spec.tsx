import * as util from '../../../newgen/utils';
const constructAuthTokenUrlSpy = jest.spyOn(util, 'constructAuthTokenUrl');

import * as React from 'react';
import { Observable } from 'rxjs';
import { ReactWrapper, mount } from 'enzyme';
import { MediaType, FileState, Identifier } from '@atlaskit/media-client';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { fakeIntl, fakeMediaClient } from '@atlaskit/media-test-helpers';
import { Header, State as HeaderState } from '../../../newgen/header';
import { MetadataFileName, MetadataSubText } from '../../../newgen/styled';
import { LeftHeader } from '../../../newgen/styled';

const identifier: Identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  mediaItemType: 'file',
};
const externalIdentifierWithName: Identifier = {
  dataURI: 'some-external-src',
  name: 'some-name',
  mediaItemType: 'external-image',
};
const externalIdentifier: Identifier = {
  dataURI: 'some-external-src',
  mediaItemType: 'external-image',
};
const identifier2: Identifier = {
  id: 'some-id-2',
  occurrenceKey: 'some-custom-occurrence-key',
  mediaItemType: 'file',
};

const processedImageState: FileState = {
  id: '123',
  mediaType: 'image',
  mimeType: 'jpeg',
  status: 'processed',
  name: 'my image',
  size: 0,
  artifacts: {},
  representations: {
    image: {},
  },
};

describe('<Header />', () => {
  afterEach(() => {
    constructAuthTokenUrlSpy.mockClear();
  });

  it('shows an empty header while loading', () => {
    const mediaClient = fakeMediaClient();
    mediaClient.file.getFileState = () => Observable.empty();
    const el = mount(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    const metadata = el.find(LeftHeader);
    expect(metadata.text()).toEqual('');
  });

  it('resubscribes to the provider when the data property value is changed', () => {
    const mediaClient = fakeMediaClient();
    mediaClient.file.getFileState = () => Observable.of(processedImageState);
    const el = mount(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    el.update();
    expect(el.find(MetadataFileName).text()).toEqual('my image');

    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    el.setProps({ identifier: identifier2 });
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(2);
  });

  it('component resets initial state when new identifier is passed', () => {
    const mediaClient = fakeMediaClient();
    mediaClient.file.getFileState = () => Observable.of(processedImageState);
    const el = mount<{}, HeaderState>(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );

    expect(el.state().item.status).toEqual('SUCCESSFUL');

    // since the test is executed synchronously
    // let's prevent the second call to getFile from immediately resolving and
    // updating the state to SUCCESSFUL before we run the assertion.
    mediaClient.file.getFileState = () => Observable.never();

    el.setProps({ identifier: identifier2 });
    expect(el.state().item.status).toEqual('PENDING');
  });

  it('component resets initial state when new context is passed', () => {
    const mediaClient = fakeMediaClient();
    mediaClient.file.getFileState = () => Observable.of(processedImageState);
    const el = mount<{}, HeaderState>(
      <Header
        intl={fakeIntl}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    expect(el.state().item.status).toEqual('SUCCESSFUL');

    // since the test is executed synchronously
    // let's prevent the second call to getFile from immediately resolving and
    // updating the state to SUCCESSFUL before we run the assertion.
    const newMediaClient = fakeMediaClient();
    mediaClient.file.getFileState = () => Observable.never();
    el.setProps({ context: newMediaClient });
    expect(el.state().item.status).toEqual('PENDING');
  });

  describe('Metadata', () => {
    it('should work with external image identifier', () => {
      const element = mount(
        <Header
          intl={fakeIntl}
          mediaClient={{} as any}
          identifier={externalIdentifierWithName}
        />,
      );

      expect(element.find(MetadataFileName).text()).toEqual('some-name');
      expect(element.find(MetadataSubText).text()).toEqual('image');
    });

    it('should default to dataURI as name when no name is passed in a external image identifier', () => {
      const element = mount(
        <Header
          intl={fakeIntl}
          mediaClient={{} as any}
          identifier={externalIdentifier}
        />,
      );

      expect(element.find(MetadataFileName).text()).toEqual(
        'some-external-src',
      );
    });

    describe('File collectionName', () => {
      it('shows the title when loaded', () => {
        const mediaClient = fakeMediaClient();
        mediaClient.file.getFileState = () =>
          Observable.of(processedImageState);
        const el = mount(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataFileName).text()).toEqual('my image');
      });

      it('shows unknown if file collectionName not provided on metadata', () => {
        const unNamedImage = {
          ...processedImageState,
          name: '',
        };
        const mediaClient = fakeMediaClient();
        mediaClient.file.getFileState = () => Observable.of(unNamedImage);
        const el = mount(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataFileName).text()).toEqual('unknown');
      });
    });

    describe('File metadata', () => {
      const testMediaTypeText = (
        mediaType: MediaType,
        expectedText: string,
      ) => {
        const testItem: FileState = {
          id: '123',
          mediaType,
          mimeType: 'jpeg',
          status: 'processed',
          name: 'my item',
          size: 12222222,
          artifacts: {},
          representations: {
            image: {},
          },
        };
        const mediaClient = fakeMediaClient();
        mediaClient.file.getFileState = () => Observable.of(testItem);
        const el = mount(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual(
          `${expectedText} · 11.7 MB`,
        );
      };

      it('should render media type text and file size for each media type', () => {
        testMediaTypeText('image', 'image');
        testMediaTypeText('audio', 'audio');
        testMediaTypeText('video', 'video');
        testMediaTypeText('unknown', 'unknown');
        testMediaTypeText('doc', 'document');
      });

      it('should not render file size if unavailable', () => {
        const noSizeImage = {
          ...processedImageState,
          size: 0,
        };
        const mediaClient = fakeMediaClient();
        mediaClient.file.getFileState = () => Observable.of(noSizeImage);
        const el = mount(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual('image');
      });

      it('should not render media type if unavailable', () => {
        const noMediaTypeElement = {
          ...processedImageState,
          mediaType: '' as MediaType,
          size: 23232323,
        };
        const mediaClient = fakeMediaClient();
        mediaClient.file.getFileState = () => Observable.of(noMediaTypeElement);
        const el = mount(
          <Header
            intl={fakeIntl}
            mediaClient={mediaClient}
            identifier={identifier}
          />,
        );
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual('unknown · 22.2 MB');
      });
    });

    it('shows nothing when metadata failed to be retrieved', () => {
      const mediaClient = fakeMediaClient();
      mediaClient.file.getFileState = () =>
        Observable.throw('something bad happened!');
      const el = mount(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifier}
        />,
      );
      const metadata = el.find(LeftHeader);
      expect(metadata.text()).toEqual('');
    });

    it('MSW-720: passes the collectionName to getFile', () => {
      const collectionName = 'some-collection';
      const mediaClient = fakeMediaClient();
      mediaClient.file.getFileState = () => Observable.of(processedImageState);
      const identifierWithCollection = { ...identifier, collectionName };
      const el = mount(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifierWithCollection}
        />,
      );
      el.update();
      expect(mediaClient.file.getFileState).toHaveBeenCalledWith('some-id', {
        collectionName: 'some-collection',
      });
    });

    it('MSW-720: passes the collectionName to mediaClient.file.downloadBinary', () => {
      const collectionName = 'some-collection';
      const mediaClient = fakeMediaClient();
      mediaClient.file.getFileState = () => Observable.of(processedImageState);
      const identifierWithCollection = { ...identifier, collectionName };
      const el = mount(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifierWithCollection}
        />,
      );
      el.update();
      el.find(DownloadIcon).simulate('click');
      expect(
        (mediaClient.file.downloadBinary as jest.Mock).mock.calls[0][2],
      ).toEqual(collectionName);
    });
  });

  describe('Download button', () => {
    const assertDownloadButton = (
      el: ReactWrapper<any, any>,
      enabled: boolean,
    ) => {
      expect(el.find({ isDisabled: !enabled }).find('button')).toHaveLength(1);
      expect(el.find(DownloadIcon)).toHaveLength(1);
    };

    it('should show the download button disabled while the item metadata is loading', () => {
      const mediaClient = fakeMediaClient();
      mediaClient.file.getFileState = () => Observable.empty();
      const el = mount(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifier}
        />,
      );
      el.update();
      assertDownloadButton(el, false);
    });

    it('should show the download button enabled when the item is loaded', () => {
      const mediaClient = fakeMediaClient();
      mediaClient.file.getFileState = () => Observable.of(processedImageState);
      const el = mount(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifier}
        />,
      );
      el.update();
      assertDownloadButton(el, true);
    });

    it('should show the download button disabled when there is an error', () => {
      const mediaClient = fakeMediaClient();
      mediaClient.file.getFileState = () =>
        Observable.throw('something bad happened!');
      const el = mount(
        <Header
          intl={fakeIntl}
          mediaClient={mediaClient}
          identifier={identifier}
        />,
      );
      el.update();
      assertDownloadButton(el, false);
    });
  });
});
