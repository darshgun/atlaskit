import { useMemo } from 'react';

/**
 * Will return a unique id that does not change between renders.
 */
export function useUniqueId(): string {
  const id = useMemo(() => {
    return (
      '_' +
      (
        Number(String(Math.random()).slice(2)) +
        Date.now() +
        Math.round(performance.now())
      ).toString(36)
    );
  }, []);

  return id;
}
