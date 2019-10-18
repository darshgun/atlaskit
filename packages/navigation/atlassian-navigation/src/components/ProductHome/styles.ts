import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
import { skeletonCSS } from '../../common/styles';
import { NavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const containerCSS = {
  alignItems: 'center',
  display: 'flex',
  [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 1}px)`]: {
    margin: `0 ${gridSize}px`,
  },
  [`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
    margin: `0 ${gridSize * 2}px`,
  },
};

export const containerSkeletonCSS = containerCSS;

const height = 40;

const heightCSS = {
  height: `${height}px`,
};

export const productIconCSS = {
  [`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
    display: 'none',
  },
};

const iconHeight = 28;

export const productIconSkeletonCSS = (theme: NavigationTheme) => ({
  borderRadius: '50%',
  width: `${iconHeight}px`,
  height: `${iconHeight}px`,
  ...productIconCSS,
  ...skeletonCSS(theme),
});

export const customProductIconCSS = {
  ...heightCSS,
  ...productIconCSS,
};

export const productLogoCSS = {
  [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 1}px)`]: {
    display: 'none',
  },
};

export const productLogoSkeletonCSS = (theme: NavigationTheme) => ({
  borderRadius: `${height / 2}px`,
  width: '120px',
  ...heightCSS,
  ...productLogoCSS,
  ...skeletonCSS(theme),
});

export const customProductLogoCSS = {
  ...heightCSS,
  ...productLogoCSS,
};
