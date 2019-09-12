/**
 * Use for any programatic motions needed at runtime.
 */
export const isReducedMotion = () => {
  const { matches } = window.matchMedia('(prefers-reduced-motion: reduce)');
  return matches;
};

/**
 * Use for any CSS based motion (animation or transition).
 * Always put at the end of your declaration for correct use of the cascade.
 */
export const reduceMotionCheck = () => ({
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    transition: 'none',
  },
});
