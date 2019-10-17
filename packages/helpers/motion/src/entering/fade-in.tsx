import React, { useEffect } from 'react';
import { ClassNames, keyframes } from '@emotion/core';
import { useStaggeredEntrance } from './staggered-entrance';
import { useExitingPersistence } from './exiting-persistence';
import { easeInOut } from '../utils/curves';
import { largeDurationMs } from '../utils/durations';
import { prefersReducedMotion } from '../utils/accessibility';
import { EnteringMotionProps } from './types';

export const fadeInAnimation = () => ({
  from: {
    opacity: 0,
    transform: 'translate3d(0, 10%, 0)',
  },
  '50%': {
    opacity: 1,
  },
  to: {
    transform: 'none',
  },
});

export const fadeOutAnimation = () => ({
  from: {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
  to: {
    opacity: 0,
    transform: 'translate3d(0, -10%, 0)',
  },
});

interface FadeInProps extends EnteringMotionProps {
  /**
   * Duration in ms.
   * How long the motion will take.
   * Defaults to `largeDurationMs`.
   */
  duration?: number;
}

/**
 * For a single element that needs a fade in entering motion.
 * This does not need Javascript to execute so it will run immediately for any SSR rendered React apps before the JS has executed.
 *
 * Will add a `className` to the direct child.
 */
const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = largeDurationMs,
}: FadeInProps) => {
  const staggered = useStaggeredEntrance();
  const { isExiting, onFinish } = useExitingPersistence();
  const delay = isExiting ? 0 : staggered.delay;

  useEffect(
    () => {
      const timeoutId = setTimeout(() => {
        onFinish && onFinish();
      }, duration + delay);

      return () => {
        clearTimeout(timeoutId);
      };
    },
    [onFinish, isExiting, duration, delay],
  );

  return (
    <ClassNames>
      {({ css }) =>
        children(
          {
            ref: staggered.ref,
            className: css({
              animationName: `${keyframes(
                isExiting ? fadeOutAnimation() : fadeInAnimation(),
              )}`,
              animationTimingFunction: easeInOut,
              animationDelay: `${delay}ms`,
              animationFillMode: isExiting ? 'forwards' : 'backwards',
              animationDuration: `${duration}ms`,
              animationPlayState: staggered.isReady ? 'running' : 'paused',
              ...prefersReducedMotion(),
            }),
          },
          isExiting ? 'exiting' : 'entering',
        )
      }
    </ClassNames>
  );
};

export default FadeIn;
