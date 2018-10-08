import * as React from 'react';
import { Component } from 'react';
import {
  createStorybookContext,
  imageFileId,
  audioFileId,
} from '@atlaskit/media-test-helpers';
import { MediaStore } from '../src';

const context = createStorybookContext();
const store = new MediaStore({
  authProvider: context.config.authProvider,
});

class Example extends Component {
  async componentDidMount() {
    const response = await store.getItems([
      {
        id: imageFileId.id,
        collection: imageFileId.collectionName,
      },
      {
        id: audioFileId.id,
        collection: audioFileId.collectionName,
      },
    ]);

    console.log(response.data.items);
  }
  render() {
    return <div>hi</div>;
  }
}

export default () => <Example />;
