import * as React from 'react';
import Button from '@atlaskit/button';
import { Identifier } from '@atlaskit/media-client';
import {
  externalImageIdentifier,
  createStorybookMediaClient,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { Container, Group, MVSidebar } from '../example-helpers/styled';
import { imageIdentifier, videoIdentifier } from '../example-helpers';
import { MediaViewer } from '../src';

const mediaClient = createStorybookMediaClient();

export type State = {
  selectedIdentifier?: Identifier;
};

interface Attachment {
  uuid: string | Promise<string>;
  created_on: any;
  created_by: any;
  description: string;
  metadata: any[];
}

const mockImageAttachment = {
  uuid: imageIdentifier.id,
  created_on: new Date(),
  created_by: { name: 'User A' },
  description: 'this is a description for an image file',
  metadata: [
    {
      heading: 'Operating System',
      values: [
        { key: 'Name', value: 'MacOS' },
        { key: 'Version', value: '10.45.0' },
      ],
    },
    {
      heading: 'Another section',
      values: [{ key: 'Some key', value: 'Some value' }],
    },
  ],
};

const mockVideoAttachment = {
  uuid: videoIdentifier.id,
  created_on: new Date(),
  created_by: { name: 'User B' },
  description: 'this is a description for a video file',
  metadata: [
    {
      heading: 'Operating System',
      values: [
        { key: 'Name', value: 'MacOS' },
        { key: 'Version', value: '10.124.0' },
      ],
    },
  ],
};

const mockExternalImageAttachment = {
  uuid: externalImageIdentifier.dataURI,
  created_on: new Date(),
  created_by: {
    name: 'User C',
  },
  description: 'this is a description for an external image',
  metadata: [
    {
      heading: 'Display Info',
      values: [{ key: 'Dimensions', value: '1000 x 500' }],
    },
  ],
};

const myAttachments = [
  mockImageAttachment,
  mockVideoAttachment,
  mockExternalImageAttachment,
];

export default class Example extends React.Component<{}, State> {
  state: State = {
    selectedIdentifier: undefined,
  };

  private openList = () => {
    this.setState({
      selectedIdentifier: imageIdentifier,
    });
  };

  private onClose = () => {
    this.setState({ selectedIdentifier: undefined });
  };

  // uses the identifier's id (or dataURI in the case of an external-image)
  // to look up some other data we have stored in our parent component
  private findAttachmentData(selectedIdentifier: Identifier) {
    const id =
      selectedIdentifier.mediaItemType === 'external-image'
        ? selectedIdentifier.dataURI
        : selectedIdentifier.id;

    return myAttachments.find(attachment => attachment.uuid === id);
  }

  sidebarRenderer = (selectedIdentifier: Identifier) => {
    const attachmentData = this.findAttachmentData(selectedIdentifier);
    if (!attachmentData) {
      return null;
    }

    return <Sidebar data={attachmentData} />;
  };

  render() {
    const { selectedIdentifier } = this.state;

    return (
      <Container>
        <Group>
          <h3>Sidebar integration with custom data</h3>
          <Button onClick={this.openList}>Open</Button>
        </Group>
        {selectedIdentifier && (
          <MediaViewer
            mediaClientConfig={mediaClient.config}
            selectedItem={selectedIdentifier}
            dataSource={{
              list: [imageIdentifier, externalImageIdentifier, videoIdentifier],
            }}
            collectionName={defaultCollectionName}
            onClose={this.onClose}
            pageSize={5}
            components={{
              sidebarRenderer: this.sidebarRenderer,
            }}
          />
        )}
      </Container>
    );
  }
}

interface SidebarProps {
  data: Attachment;
}

const Sidebar = (props: SidebarProps) => {
  const { created_by, description, metadata, created_on } = props.data;
  return (
    <MVSidebar>
      <h2>Details</h2>
      <p>
        Created by {created_by.name} on {created_on.toLocaleDateString('en-US')}
      </p>
      <p>{description}</p>

      {/* metadata sections */}
      {metadata.map(({ heading, values }, idx) => (
        <table key={idx}>
          <tr>
            <th>{heading}</th>
          </tr>
          <tbody>
            {values.map((v: any) => (
              <tr>
                <td>{v.key}</td>
                <td>{v.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </MVSidebar>
  );
};
