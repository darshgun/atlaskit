import { useState, useEffect } from 'react';

export interface ElementBoundingBox {
  height: number;
  left: number;
  top: number;
  width: number;
}

const getElementRect = (element: HTMLElement): ElementBoundingBox => {
  const { height, left, top, width } = element.getBoundingClientRect();
  return {
    height,
    left,
    top,
    width,
  };
};

/**
 * Will listen to the document resizing to see if an element has moved positions.
 * Not using ResizeObserver because of IE11 support.
 * @param element HTMLElement to watch when resizing.
 */
export const useElementBox = (element: HTMLElement) => {
  const [box, setBox] = useState<ElementBoundingBox>(getElementRect(element));

  useEffect(() => {
    const onResize = () => {
      requestAnimationFrame(() => {
        setBox(getElementRect(element));
      });
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [element]);

  return box;
};

export const ElementBox = (props: {
  element: HTMLElement;
  children: (box: ElementBoundingBox) => any;
}) => {
  const box = useElementBox(props.element);
  return props.children(box);
};
