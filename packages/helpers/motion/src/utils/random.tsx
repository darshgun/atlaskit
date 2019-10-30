import { useMemo } from 'react';

let count = 0;

/**
 * Will return a unique id that does not change between renders.
 * THIS IS NOT STABLE FOR SSR!
 * Do not use this to render DOM markup (attributes or otherwise).
 */
export function useUniqueId(): string {
  const id = useMemo(() => `${count++}`, []);
  return id;
}
