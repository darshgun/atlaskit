import { useEffect, useRef } from 'react';

/**
 * Will return request animation frame as a function which will clean itself up before the next effect.
 */
export const useRequestAnimationFrame = () => {
  const frames = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (frames.current.length) {
        frames.current.forEach(id => cancelAnimationFrame(id));
        frames.current = [];
      }
    };
  });

  return (handler: FrameRequestCallback) => {
    const id = requestAnimationFrame(handler);
    frames.current.push(id);
  };
};

/**
 * Will return set  timeout as a function which will clean itself up before the next effect.
 */
export const useSetTimeout = () => {
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (timeouts.current.length) {
        timeouts.current.forEach(id => clearTimeout(id));
        timeouts.current = [];
      }
    };
  });

  return (
    handler: TimerHandler,
    timeout?: number | undefined,
    ...args: any[]
  ) => {
    const id = setTimeout(handler, timeout, ...args);
    timeouts.current.push(id);
  };
};
