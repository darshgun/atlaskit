import { useRef, useLayoutEffect } from 'react';

export const useIsFirstRender = () => {
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
  });

  return firstRender.current;
};
