import { NavigationTheme } from '../theme';
import { CREATE_BREAKPOINT } from './constants';

export const actionSectionDesktopCSS = {
  [`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
    display: 'none',
  },
};

export const actionSectionMobileCSS = {
  [`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
    display: 'none',
  },
};

export const skeletonCSS = ({ mode: { skeleton } }: NavigationTheme) => ({
  opacity: 0.15,
  ...skeleton,
});
