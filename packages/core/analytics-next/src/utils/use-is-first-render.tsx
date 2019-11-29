import { useRef, useEffect } from 'react';

export const useIsFirstRender = () => {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
  });

  return firstRender.current;
};
