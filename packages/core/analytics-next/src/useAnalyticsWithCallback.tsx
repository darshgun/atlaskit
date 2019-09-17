import { useCallback, useRef } from 'react';
import { useAnalyticsEvents } from './useAnalyticsEvents';

export type UseAnalyticsWithCallbackHook = (
  method: any,
  payload: any,
) => (...args: any[]) => void;

export const useAnalyticsWithCallback: UseAnalyticsWithCallbackHook = (
  method,
  payload,
) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  // given input might be new function/object each render
  // we optimise and store in refs so we can memoize the callback
  // and at the same time avoid stale values
  const methodRef = useRef(method);
  const payloadRef = useRef(payload);

  return useCallback(
    (...args) => {
      const pload =
        typeof payloadRef.current === 'function'
          ? payloadRef.current(...args)
          : payloadRef.current;
      createAnalyticsEvent(pload).fire();
      methodRef.current(...args);
    },
    [createAnalyticsEvent, methodRef, payloadRef],
  );
};
