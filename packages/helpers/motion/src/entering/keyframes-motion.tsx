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
export interface KeyframesMotionProps {
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
   * Will callback when the motion has finished in the particular direction.
   * If it finished entering direction will be `entering`.
   * And vice versa for `exiting`.
   */
  onFinish?: (direction: Direction) => void;

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

interface InternalKeyframesMotionProps extends KeyframesMotionProps {
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
 * Used to multipy the initial duration for exiting motions.
 */
const EXITING_MOTION_MULTIPLIER = 0.5;

/**
 * This is the base INTERNAL component used for all other entering motions.
 * This does not need Javascript to execute on the client so it will run immediately
 * for any SSR rendered React apps before the JS has executed.
 */
const EnteringMotion: React.FC<InternalKeyframesMotionProps> = ({
  children,
  animationTimingFunction,
  enteringAnimation,
  exitingAnimation,
  isPaused,
  onFinish: onFinishMotion,
  duration = largeDurationMs,
}: InternalKeyframesMotionProps) => {
  const staggered = useStaggeredEntrance();
  const {
    isExiting,
    onFinish: onExitFinished,
    appear,
  } = useExitingPersistence();
  const paused = isPaused || !staggered.isReady;
  const delay = isExiting ? 0 : staggered.delay;
  const direction = isExiting ? 'exiting' : 'entering';
  const actualDuration = appear === false ? 0 : duration;

  useEffect(() => {
    if (paused) {
      return;
    }

    const timeoutId = setTimeout(
      () => {
        if (direction === 'exiting') {
          onExitFinished && onExitFinished();
        }

        onFinishMotion && onFinishMotion(direction);
      },
      isExiting
        ? actualDuration * EXITING_MOTION_MULTIPLIER
        : actualDuration + delay,
    );

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    onExitFinished,
    onFinishMotion,
    direction,
    isExiting,
    actualDuration,
    delay,
    paused,
  ]);

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
              animationDuration: `${
                isExiting
                  ? actualDuration * EXITING_MOTION_MULTIPLIER
                  : actualDuration
              }ms`,
              animationPlayState: paused ? 'paused' : 'running',
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
