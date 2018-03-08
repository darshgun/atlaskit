import * as React from 'react';
import { Component } from 'react';
import { Ellipsify } from '@atlaskit/media-ui';

import { ProgressBar } from '../progressBar';
import { MediaImage } from '../mediaImage';
import CardActions from '../cardActions';
import { CardAction, CardActionType } from '../../actions';
import {
  Wrapper,
  Overlay,
  Title,
  Body,
  ProgressWrapper,
  CancelButtonWrapper,
} from './styled';

export interface UploadingViewProps {
  title?: string;
  progress: number;
  dataURI?: string;
  actions?: CardAction[];
}

export class UploadingView extends Component<UploadingViewProps, {}> {
  render() {
    const { title, progress, dataURI, actions = [] } = this.props;

    return (
      <Wrapper>
        <Overlay>
          <Title>
            <Ellipsify text={title || ''} lines={2} />
          </Title>
          <Body>
            <ProgressWrapper>
              <ProgressBar progress={progress} />
            </ProgressWrapper>
            <CardActions actions={actions} triggerColor="white" />
          </Body>
        </Overlay>
        {dataURI && <MediaImage dataURI={dataURI} />}
      </Wrapper>
    );
  }
}
