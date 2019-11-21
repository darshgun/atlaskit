import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@atlaskit/button';
import AkSpinner from '@atlaskit/spinner';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import {
  ExternalImageIdentifier,
  Identifier,
  FileState,
} from '@atlaskit/media-client';
import {
  externalImageIdentifier,
  externalSmallImageIdentifier,
  createStorybookMediaClient,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import {
  ButtonList,
  Container,
  Group,
  MVSidebar,
} from '../example-helpers/styled';
import {
  docIdentifier,
  largePdfIdentifier,
  imageIdentifier,
  imageIdentifier2,
  unsupportedIdentifier,
  videoHorizontalFileItem,
  videoIdentifier,
  wideImageIdentifier,
  audioItem,
  audioItemNoCover,
} from '../example-helpers';
import { MediaViewer, MediaViewerDataSource } from '../src';

const mediaClient = createStorybookMediaClient();

export type State = {
  selected?: {
    dataSource: MediaViewerDataSource;
    identifier: Identifier;
  };
  sidebarFileState?: FileState;
};

export default class Example extends React.Component<{}, State> {
  state: State = {};

  private openList = () => {
    this.setState({
      selected: {
        dataSource: {
          list: [
            externalImageIdentifier,
            imageIdentifier,
            videoIdentifier,
            externalSmallImageIdentifier,
            videoHorizontalFileItem,
            wideImageIdentifier,
            audioItem,
            audioItemNoCover,
            docIdentifier,
            largePdfIdentifier,
            imageIdentifier2,
            unsupportedIdentifier,
          ],
        },
        identifier: imageIdentifier,
      },
    });
  };

  private onClose = () => {
    this.setState({ selected: undefined });
  };

  sidebarRenderer = (selectedIdentifier: Identifier) => {
    return <Sidebar identifier={selectedIdentifier} />;
  };

  render() {
    const { selected } = this.state;
    return (
      <Container>
        <Group>
          <h2>Sidebar integration</h2>
          <ButtonList>
            <li>
              <Button onClick={this.openList}>Open</Button>
            </li>
          </ButtonList>
        </Group>
        {selected && (
          <MediaViewer
            mediaClientConfig={mediaClient.config}
            selectedItem={selected.identifier}
            dataSource={selected.dataSource}
            collectionName={defaultCollectionName}
            onClose={this.onClose}
            pageSize={5}
            extensions={{
              sidebar: {
                renderer: this.sidebarRenderer,
                icon: <EditorPanelIcon label="sidebar" />,
              },
            }}
          />
        )}
      </Container>
    );
  }
}

interface SidebarProps {
  identifier: Identifier;
}

const Sidebar = (props: SidebarProps) => {
  const { identifier } = props;
  const [fileState, setFileState] = useState<FileState | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const renderFileStateItem = <FileState, K extends keyof FileState>(
    fileState: FileState,
    item: K,
  ) => {
    return (
      <tr>
        <td>{item}: </td>
        <td>{(fileState && fileState[item]) || <i>Unknown</i>}</td>
      </tr>
    );
  };

  const renderFileState = () => {
    if (isLoading) {
      return <AkSpinner />;
    }
    if (!fileState) {
      return null;
    }
    if (fileState.status === 'error') {
      return <p>Error loading attachment details</p>;
    }
    return (
      <table>
        <tbody>
          {renderFileStateItem(fileState, 'id')}
          {renderFileStateItem(fileState, 'mediaType')}
          {renderFileStateItem(fileState, 'mimeType')}
          {renderFileStateItem(fileState, 'name')}
          {renderFileStateItem(fileState, 'size')}
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    if (identifier.mediaItemType === 'file') {
      setIsLoading(true);
      const deferredIdentifier =
        identifier.id instanceof Promise
          ? identifier.id
          : Promise.resolve(identifier.id);
      deferredIdentifier.then(id => {
        mediaClient.file
          .getFileState(id, { collectionName: identifier.collectionName })
          .subscribe({
            next: newFileState => {
              setFileState(newFileState);
              setIsLoading(false);
            },
          });
      });
    }
  }, [identifier]);

  const renderExternalFileState = (identifier: ExternalImageIdentifier) => {
    return (
      <>
        <p>External file</p>
        <p>{identifier.dataURI}</p>
      </>
    );
  };

  return (
    <MVSidebar>
      <h2>Attachment details</h2>
      {identifier.mediaItemType === 'file'
        ? renderFileState()
        : renderExternalFileState(identifier)}
    </MVSidebar>
  );
};
