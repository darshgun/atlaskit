import { useRef } from 'react';

/**
 * This hook tries to emulate the getSnapshotBeforeUpdate lifecycle method.
 */
export const useSnapshotBeforeUpdate = (cb: Function) => {
  const renderCount = useRef(0);

  // We only consider it an update after the first render.
  if (renderCount.current > 0) {
    cb();
  } else {
    renderCount.current += 1;
  }
};
