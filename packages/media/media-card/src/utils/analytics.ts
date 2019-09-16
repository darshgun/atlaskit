import {
  FileDetails,
  MediaType,
  FileProcessingStatus,
} from '@atlaskit/media-client';

import { GasCorePayload } from '@atlaskit/analytics-gas-types';
import {
  version as packageVersion,
  name as packageName,
} from '../version.json';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
  createAndFireEvent,
} from '@atlaskit/analytics-next';

import { ANALYTICS_MEDIA_CHANNEL } from '../root/media-card-analytics-error-boundary';

export interface MediaCardAnalyticsFileAttributes {
  fileSource: string;
  fileMediatype?: MediaType;
  fileId?: string;
  fileStatus?: FileProcessingStatus;
  fileSize?: number;
}

export type MediaCardAnalyticsPayoladBase = Partial<GasCorePayload> & {
  action?: string;
  attributes?: GasCorePayload['attributes'] & {
    fileAttributes?: MediaCardAnalyticsFileAttributes;
  };
};

export type MediaCardAnalyticsPayolad = MediaCardAnalyticsPayoladBase & {
  attributes: MediaCardAnalyticsPayoladBase['attributes'] & {
    packageName: string; // Mandatory attribute. It is used by Media Listener to merge this object with Context Data Object
  };
};

export function getBaseAnalyticsContext(): GasCorePayload['attributes'] {
  return {
    packageVersion,
    packageName,
    componentName: 'MediaCard',
  };
}

export const getFileAttributes = (
  metadata?: FileDetails,
): MediaCardAnalyticsFileAttributes => ({
  fileSource: 'mediaCard',
  fileMediatype: metadata && metadata.mediaType,
  fileId: metadata && metadata.id,
  fileSize: metadata && metadata.size,
  fileStatus: metadata && metadata.processingStatus,
});

export function getUIAnalyticsContext(
  actionSubjectId: string,
  metadata?: FileDetails,
): MediaCardAnalyticsPayolad {
  const fileAttributes = getFileAttributes(metadata);

  const currentActionSujectId =
    metadata && metadata.id ? metadata.id : actionSubjectId;
  return {
    actionSubjectId: currentActionSujectId,
    attributes: {
      packageName,
      ...getBaseAnalyticsContext(),
      fileAttributes: {
        ...fileAttributes,
      },
    },
  };
}

function attachPackageName(
  basePayload: MediaCardAnalyticsPayoladBase,
): MediaCardAnalyticsPayolad {
  return {
    ...basePayload,
    attributes: {
      packageName,
      ...(basePayload.attributes || {}),
    },
  };
}

export function createAndFireCustomMediaEvent(
  basePayload: MediaCardAnalyticsPayoladBase,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  const payload = attachPackageName(basePayload);
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent(payload);
    event.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}

type CreateAndFireMediaEvent = (
  basePayload: MediaCardAnalyticsPayoladBase,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent;

export const createAndFireMediaEvent: CreateAndFireMediaEvent = basePayload => {
  const payload = attachPackageName(basePayload);
  return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(payload);
};
