import React, { Ref, useEffect } from 'react';
import { ClassNames, keyframes, ObjectInterpolation } from '@emotion/core';
import { useStaggeredEntrance } from './staggered-entrance';
import { useExitingPersistence } from './exiting-persistence';
import { largeDurationMs } from '../utils/durations';
import { prefersReducedMotion } from '../utils/accessibility';

export type Direction = 'entering' | 'exiting';

/**
 * These are props that motions should use as their external props for consumers.
 * See [FadeIn](packages/helpers/motion/src/entering/fade-in.tsx) for an example usage.
 */
export interface EnteringMotionProps {
  /**
   * Duration in `ms`.
   * How long the motion will take.
   */
  duration?: number;

  /**
   * Use to pause the animation.
   */
  isPaused?: boolean;

  /**
   * Children as `function`.
   * Will be passed `props` for you to hook up.
   * The `direction` arg can be used to know if the motion is `entering` or `exiting`.
   */
  children: (
    props: { className: string; ref: Ref<any> },
    direction: Direction,
  ) => JSX.Element;
}

interface InternalEnteringMotionProps extends EnteringMotionProps {
  /**
   * Timing function to be used with the animation.
   * Receives the `direction` and expects a `string` return value.
   * Useful if you want a different curve when entering vs. exiting.
   */
  animationTimingFunction: (direction: Direction) => string;

  /**
   * CSS keyframes for the entering animation.
   */
  enteringAnimation: ObjectInterpolation<undefined>;

  /**
   * CSS keyframes for the exiting animation.
   */
  exitingAnimation?: ObjectInterpolation<undefined>;

  /**
   * Duration in `ms`.
   * How long the motion will take.
   */
  duration: number;

  /**
   * Children as function.
   * Will be passed `props` for you to hook up.
   * The `direction` arg can be used to know if the motion is entering or exiting.
   */
  children: (
    props: { className: string; ref: Ref<any> },
    direction: Direction,
  ) => JSX.Element;
}

/**
 * This is the base INTERNAL component used for all other entering motions.
 * This does not need Javascript to execute on the client so it will run immediately
 * for any SSR rendered React apps before the JS has executed.
 */
const EnteringMotion: React.FC<InternalEnteringMotionProps> = ({
  children,
  animationTimingFunction,
  enteringAnimation,
  exitingAnimation,
  isPaused,
  duration = largeDurationMs,
}: InternalEnteringMotionProps) => {
  const staggered = useStaggeredEntrance();
  const { isExiting, onFinish } = useExitingPersistence();
  const delay = isExiting ? 0 : staggered.delay;
  const direction = isExiting ? 'exiting' : 'entering';

  useEffect(
    () => {
      if (isPaused) {
        return;
      }

      const timeoutId = setTimeout(() => {
        onFinish && onFinish();
      }, duration + delay);

      return () => {
        clearTimeout(timeoutId);
      };
    },
    [onFinish, isExiting, duration, delay, isPaused],
  );

  return (
    <ClassNames>
      {({ css }) =>
        children(
          {
            ref: staggered.ref,
            className: css({
              animationName: `${keyframes(
                isExiting
                  ? exitingAnimation || enteringAnimation
                  : enteringAnimation,
              )}`,
              animationTimingFunction: animationTimingFunction(direction),
              animationDelay: `${delay}ms`,
              animationFillMode: isExiting ? 'forwards' : 'backwards',
              animationDuration: `${duration}ms`,
              animationPlayState:
                staggered.isReady || !isPaused ? 'running' : 'paused',
              ...prefersReducedMotion(),
            }),
          },
          direction,
        )
      }
    </ClassNames>
  );
};

export default EnteringMotion;
