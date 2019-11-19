import { Identifier, MediaClient } from '@atlaskit/media-client';
import { MediaViewerFeatureFlags } from '../newgen/domain';
import { ReactNode } from 'react';

export interface MediaViewerDataSource {
  list?: Array<Identifier>;
  collectionName?: string;
}

export interface MediaViewerComponents {
  sidebarRenderer?: (selectedIdentifier: Identifier) => ReactNode;
}

export interface MediaViewerProps {
  readonly mediaClient: MediaClient;
  readonly selectedItem: Identifier;
  readonly dataSource: MediaViewerDataSource;

  readonly collectionName: string;
  readonly pageSize?: number;

  readonly onClose?: () => void;

  readonly featureFlags?: MediaViewerFeatureFlags;
  readonly components?: MediaViewerComponents;
}
