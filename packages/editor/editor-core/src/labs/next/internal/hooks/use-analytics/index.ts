import * as React from 'react';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorSharedConfig } from '../../../internal/context/shared-config';
import {
  analyticsEventKey,
  AnalyticsEventPayload,
} from '../../../../../plugins/analytics';

/**
 * Subscribes to analytics events fired from editor components
 * and passes them through to `fireAnalyticsEvent`.
 */
export function useAnalyticsHandler(
  editorSharedConfigRef: React.MutableRefObject<EditorSharedConfig | null>,
) {
  // handleAnalyticsEvent – must always be the same so we can unsubscribe from events properly.
  const handleAnalyticsEvent = React.useCallback<
    (payloadChannel: {
      payload: AnalyticsEventPayload;
      channel?: string;
    }) => void
  >(
    payload => {
      const handleAnalyticsEvent =
        editorSharedConfigRef &&
        editorSharedConfigRef.current &&
        editorSharedConfigRef.current.dispatchAnalyticsEvent;

      if (!handleAnalyticsEvent) {
        return;
      }

      handleAnalyticsEvent(payload);
    },
    [editorSharedConfigRef],
  );

  const sharedConfig = editorSharedConfigRef.current;
  if (sharedConfig) {
    sharedConfig.eventDispatcher.on(analyticsEventKey, handleAnalyticsEvent);
  }

  React.useEffect(
    () => () => {
      if (!sharedConfig || !sharedConfig.eventDispatcher) {
        return;
      }

      sharedConfig.eventDispatcher.off(analyticsEventKey, handleAnalyticsEvent);
    },
    [sharedConfig, handleAnalyticsEvent],
  );
}

export function useCreateAnalyticsHandler(
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  return React.useCallback(
    ({
      payload,
      channel,
    }: {
      payload: Record<string, any>;
      channel?: string;
    }) => createAnalyticsEvent && createAnalyticsEvent(payload).fire(channel),
    [createAnalyticsEvent],
  );
}
