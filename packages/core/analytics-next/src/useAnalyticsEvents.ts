import { useContext, useRef } from 'react';
import { useCallbackOne } from 'use-memo-one';
import {
  AnalyticsReactContext,
  AnalyticsReactContextInterface,
} from './AnalyticsReactContext';
import { CreateUIAnalyticsEvent } from './types';
import UIAnalyticsEvent from './UIAnalyticsEvent';
import { AnalyticsEventPayload } from './AnalyticsEvent';
import { useIsFirstRender } from './utils/use-is-first-render';

export type UseAnalyticsEventsHook = {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
};

const WARN_NO_CONTEXT = `
@atlaskit/analytics-next
---
No compatible <AnalyticsListener /> was found to fire this analytics event.
Use of the useAnalyticsEvents() hook requires a parent <AnalyticsListener /> from @atlaskit/analytics-next@^6.3.0 or above.
See: https://atlaskit.atlassian.com/packages/core/analytics-next/docs/reference#AnalyticsListener
`;

const noop = () => [];

export function useAnalyticsEvents(): UseAnalyticsEventsHook {
  const isFirstRender = useIsFirstRender();
  const analyticsContext = useContext(AnalyticsReactContext);
  const contextRef = useRef<AnalyticsReactContextInterface>(analyticsContext);
  contextRef.current.getAtlaskitAnalyticsEventHandlers =
    analyticsContext.getAtlaskitAnalyticsEventHandlers;
  contextRef.current.getAtlaskitAnalyticsContext =
    analyticsContext.getAtlaskitAnalyticsContext;

  if (
    process.env.NODE_ENV !== 'production' &&
    (contextRef.current.getAtlaskitAnalyticsEventHandlers === null ||
      contextRef.current.getAtlaskitAnalyticsContext === null) &&
    isFirstRender
  ) {
    /* eslint-disable-next-line no-console */
    console.error(WARN_NO_CONTEXT);
  }

  const createAnalyticsEvent = useCallbackOne(
    (payload: AnalyticsEventPayload): UIAnalyticsEvent => {
      if (
        process.env.NODE_ENV !== 'production' &&
        (contextRef.current.getAtlaskitAnalyticsEventHandlers === null ||
          contextRef.current.getAtlaskitAnalyticsContext === null)
      ) {
        /* eslint-disable-next-line no-console */
        console.error(WARN_NO_CONTEXT);
      }

      const getAtlaskitAnalyticsContext =
        contextRef.current.getAtlaskitAnalyticsContext || noop;
      const getAtlaskitAnalyticsEventHandlers =
        contextRef.current.getAtlaskitAnalyticsEventHandlers || noop;

      return new UIAnalyticsEvent({
        context: getAtlaskitAnalyticsContext(),
        handlers: getAtlaskitAnalyticsEventHandlers(),
        payload,
      });
    },
    [],
  );

  return {
    createAnalyticsEvent,
  };
}
