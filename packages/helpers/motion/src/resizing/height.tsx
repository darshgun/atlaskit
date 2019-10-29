import { useRef, useLayoutEffect } from 'react';
import { isReducedMotion } from '../utils/accessibility';
import { mediumDurationMs } from '../utils/durations';
import { easeInOut } from '../utils/curves';
import { useSnapshotBeforeUpdate } from '../utils/use-snapshot-before-update';

interface ResizingHeightOpts {
  /**
   * Duration as a `function`.
   * Will receive previous and next `height` and return the `duration`.

   * By default this will match the [ADG specifications](https://atlassian.design) for how long motion should take.
   * Design specifications are still a work in progress.
   */
  duration?: (prevHeight: number, nextHeight: number) => number;

  /**
   * Timing function as a `function`.
   * This is handy for changing the curve depending on the user interaction.
   * Does the user interact [directly or indirectly](/packages/helpers/motion/docs/variables)?
   * You'll want to use an appropriate curve.
   * Will receive previous and next `height`,
   * `duration`,
   * and return the [timing function](https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function).

   * By default this will assume indirect motion using `easeInOut`.
   */
  timingFunction?: (
    prevHeight: number,
    nextHeight: number,
    duration: number,
  ) => string;
}

interface Dimensions {
  height: number;
}

export const useResizingHeight = ({
  duration: calcDuration = () => mediumDurationMs,
  timingFunction: calcTimingFunction = () => easeInOut,
}: ResizingHeightOpts = {}) => {
  const prevDimensions = useRef<Dimensions>();
  const childRef = useRef<HTMLElement>();
  const inflightTimeout = useRef<number>();

  useSnapshotBeforeUpdate(() => {
    if (isReducedMotion() || !childRef.current) {
      return;
    }

    prevDimensions.current = childRef.current.getBoundingClientRect();
  });

  useLayoutEffect(() => {
    if (isReducedMotion() || !childRef.current || !prevDimensions.current) {
      return;
    }

    // We might already be animating.
    // Because of that we need to expand to the destination height first.
    childRef.current.setAttribute('style', '');

    const nextDimensions = childRef.current.getBoundingClientRect();
    if (nextDimensions.height === prevDimensions.current.height) {
      return;
    }

    const duration = calcDuration(
      prevDimensions.current.height,
      nextDimensions.height,
    );

    const newStyles: Partial<CSSStyleDeclaration> = {
      height: `${prevDimensions.current.height}px`,
      willChange: 'height',
      transitionProperty: 'height',
      transitionDuration: `${duration}ms`,
      boxSizing: 'border-box',
      transitionTimingFunction: calcTimingFunction(
        prevDimensions.current.height,
        nextDimensions.height,
        duration,
      ),
    };
    Object.assign(childRef.current.style, newStyles);

    // We split this over two animation frames so the DOM has enough time to flush the changes.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!childRef.current) {
          return;
        }

        childRef.current.style.height = `${nextDimensions.height}px`;

        inflightTimeout.current = window.setTimeout(() => {
          window.requestAnimationFrame(() => {
            if (!childRef.current) {
              return;
            }

            childRef.current.setAttribute('style', '');
          });
        }, duration);
      });
    });

    return () => {
      if (inflightTimeout.current !== undefined) {
        window.clearTimeout(inflightTimeout.current);
        inflightTimeout.current = undefined;
      }
    };
  });

  return { ref: childRef as React.MutableRefObject<any> };
};

/**
 * This exists only to be able to extract opts.
 */
export default (opts: ResizingHeightOpts) => {};
