import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
  useContext,
  createContext,
  useMemo,
} from 'react';
import throttle from 'lodash.throttle';

import { OverflowProviderProps } from './types';

const THROTTLE_INTERVAL = 100;
const ITEM_APPROX_MINWIDTH = 50;
const calculateHash = (w: number, n: number) => w + '#' + n;

const OverflowContext = createContext({
  isVisible: true,
});

export const OverflowProvider = ({
  children,
  isVisible,
}: OverflowProviderProps) => {
  const { Provider } = OverflowContext;
  const value = useMemo(() => ({ isVisible }), [isVisible]);
  return <Provider value={value}>{children}</Provider>;
};

export const useOverflowStatus = () => useContext(OverflowContext);

export const useOverflowController = (nodes: ReactNode | ReactNode[]) => {
  const items = React.Children.toArray(nodes);
  const [width, setWidth] = useState(9999);
  const [itemsLimit, setItemsLimit] = useState(items.length);
  const [forceEffectValue, triggerForceEffect] = useState({});
  const itemsWidths = useRef<number[]>([]).current;
  const hashRef = useRef('');

  const throttleSetWidth = useCallback(throttle(setWidth, THROTTLE_INTERVAL), [
    setWidth,
  ]);

  useEffect(
    () => {
      const lastItemWidth = itemsWidths[itemsLimit];
      const wasJustLimited = lastItemWidth < 0;
      const currentHash = calculateHash(width, itemsLimit);

      if (hashRef.current === currentHash) {
        // after removing an item, if width has not changed yet we shedule a force update
        // to handle case where removing an item does not actually trigger width change
        const t = setTimeout(() => {
          hashRef.current = '';
          triggerForceEffect({});
        }, THROTTLE_INTERVAL + 50);
        return () => clearTimeout(t);
      }

      if (wasJustLimited) {
        // width was updated either via resize or after changing the limit
        // we cap the width between ITEM_APPROX_MINWIDTH and 2*ITEM_APPROX_MINWIDTH
        // because width is throttled so when expanding/resizing it fast, partialWidth
        // will not be reliable (edge case)
        const partialWidth = Math.max(
          Math.min(width + lastItemWidth, ITEM_APPROX_MINWIDTH * 2),
          ITEM_APPROX_MINWIDTH,
        );
        itemsWidths[itemsLimit] = partialWidth;
      }

      if (width < ITEM_APPROX_MINWIDTH * 0.9 && itemsLimit) {
        // if current width is less than an item approx width we remove an item
        // marking the width as negative so we will calculate it on width update
        // plus we set the has to stabilise not removing more than one element
        // until we are sure width was updated
        setItemsLimit(itemsLimit - 1);
        itemsWidths[itemsLimit - 1] = -(width || 1);
        hashRef.current = calculateHash(width, itemsLimit - 1);
        return;
      }

      if (
        width - itemsWidths[itemsLimit] > ITEM_APPROX_MINWIDTH * 1.1 &&
        itemsLimit < items.length
      ) {
        // if we have enough room to accomodate next item width we increase the limit
        setItemsLimit(itemsLimit + 1);
        hashRef.current = calculateHash(width, itemsLimit + 1);
        return;
      }
    },
    [width, hashRef, itemsLimit, itemsWidths, forceEffectValue, items.length],
  );

  return {
    visibleItems: items.slice(0, itemsLimit),
    overflowItems: items.slice(itemsLimit),
    updateWidth: throttleSetWidth,
  };
};
