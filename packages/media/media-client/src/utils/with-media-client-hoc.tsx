import * as React from 'react';
import { MediaClientConfig } from '@atlaskit/media-core';
import { MediaClient } from '../client/media-client';

export interface WithMediaClientConfig {
  mediaClientConfig: MediaClientConfig;
}

export interface WithMediaClient {
  mediaClient: MediaClient;
}

const mediaClientsMap = new Map<MediaClientConfig, MediaClient>();

export const getMediaClient = (props: WithMediaClientConfig): MediaClient => {
  const { mediaClientConfig } = props;
  let mediaClient: MediaClient | undefined = mediaClientsMap.get(
    mediaClientConfig,
  );

  if (!mediaClient) {
    mediaClient = new MediaClient(mediaClientConfig);
    mediaClientsMap.set(mediaClientConfig, mediaClient);
  }
  return mediaClient;
};

export type WithMediaClientConfigProps<P extends WithMediaClient> = Omit<
  P,
  'mediaClient'
> &
  WithMediaClientConfig;

export type WithMediaClientFunction = <P extends WithMediaClient>(
  Component: React.ComponentType<P>,
) => React.ComponentType<WithMediaClientConfigProps<P>>;

export const withMediaClient: WithMediaClientFunction = <
  P extends WithMediaClient
>(
  Component: React.ComponentType<P>,
) => {
  return class extends React.Component<WithMediaClientConfigProps<P>> {
    render() {
      const props = this.props;
      return (
        <Component {...props as any} mediaClient={getMediaClient(this.props)} />
      );
    }
  };
};
