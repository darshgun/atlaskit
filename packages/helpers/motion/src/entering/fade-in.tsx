import React, { forwardRef, Ref } from 'react';
import { ClassNames, keyframes } from '@emotion/core';
import { easeInOut } from '../utils/curves';
import { largeDurationMs } from '../utils/durations';
import { prefersReducedMotion } from '../utils/accessibility';

export const fadeInAnimation = () => ({
  from: {
    opacity: 0,
    transform: 'translate3d(0, 10%, 0)',
  },
  to: {
    opacity: 1,
    transform: 'none',
  },
});

interface FadeInProps {
  /**
   * Delay in ms.
   * The animation will be delayed this long before running.
   * Defaults to `0`.
   */
  delay?: number;

  /**
   * Duration in ms.
   * How long the animation will take.
   * Defaults to `largeDurationMs`.
   */
  duration?: number;

  /**
   * Use to pause the animation.
   */
  isPaused?: boolean;

  /**
   * Children as function.
   * Will be passed `props` for you to hook up.
   */
  children: (props: { className: string; ref: Ref<any> }) => JSX.Element;
}

/**
 * For a single element that needs a fade in entering animation.
 * This does not need Javascript to execute so it will run immediately for any SSR rendered React apps before the JS has executed.
 *
 * Will add a `className` to the direct child.
 */
const FadeIn: React.FC<FadeInProps> = forwardRef<HTMLElement, FadeInProps>(
  (
    { children, isPaused, delay = 0, duration = largeDurationMs }: FadeInProps,
    ref,
  ) => {
    return (
      <ClassNames>
        {({ css }) =>
          children({
            ref,
            className: css({
              animationName: `${keyframes(fadeInAnimation())}`,
              animationTimingFunction: easeInOut,
              animationDelay: `${delay}ms`,
              animationFillMode: 'backwards',
              animationDuration: `${duration}ms`,
              animationPlayState: isPaused ? 'paused' : 'running',
              ...prefersReducedMotion(),
            }),
          })
        }
      </ClassNames>
    );
  },
);

export default FadeIn;
