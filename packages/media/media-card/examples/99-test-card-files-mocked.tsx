import * as React from 'react';
import {
  StoryList,
  imageFileId,
  wideImage,
  defaultBaseUrl,
  generateFilesFromTestData,
  MediaMock,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { FileIdentifier } from '@atlaskit/media-client';

import { Card } from '../src';
import { MediaClientConfig } from '@atlaskit/media-core';

const files = generateFilesFromTestData([
  {
    name: 'media-test-file-1.png',
    ...imageFileId,
    dataUri: wideImage,
  },
]);

const mediaMock = new MediaMock({
  [defaultCollectionName]: files,
});
mediaMock.enable();

const mediaClientConfig: MediaClientConfig = {
  authProvider: () =>
    Promise.resolve({
      clientId: '',
      token: '',
      baseUrl: defaultBaseUrl,
    }),
};

// standard
const successIdentifier: FileIdentifier = imageFileId;
const standardCards = [
  {
    title: 'Image',
    content: (
      <div data-test-id="media-card-standard">
        <Card
          identifier={successIdentifier}
          mediaClientConfig={mediaClientConfig}
          appearance="image"
        />
      </div>
    ),
  },
];
const cardWithContextId = [
  {
    title: 'Image with parameter',
    content: (
      <div data-test-id="media-card-with-context-id">
        <Card
          identifier={successIdentifier}
          mediaClientConfig={mediaClientConfig}
          appearance="image"
          contextId="some-id"
        />
      </div>
    ),
  },
];

export default () => (
  <div>
    <h1 style={{ margin: '10px 20px' }}>File cards</h1>
    <div style={{ margin: '20px 40px' }}>
      <h3>Standard</h3>
      <StoryList>{standardCards}</StoryList>
      <StoryList>{cardWithContextId}</StoryList>
    </div>
  </div>
);
