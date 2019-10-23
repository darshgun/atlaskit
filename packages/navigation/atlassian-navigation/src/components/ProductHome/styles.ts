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
  // Ensure anything passed into
  // productHome is aligned correctly
  '& > *': {
    display: 'flex',
  },
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
  // Ensure anything passed into
  // productHome is aligned correctly
  '& > *': {
    display: 'flex',
  },
  [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 1}px)`]: {
    display: 'none',
  },
};

export const siteNameCSS = ({
  mode: {
    navigation: { color },
  },
}: NavigationTheme) => ({
  marginLeft: `${gridSize * 0.5}px`,
  display: 'flex',
  alignItems: 'center',

  // Alternate and leaner way of adding separator
  // go with this if border color opacity can be solved with
  // theme generator.
  // paddingRight: gridSize * 3,
  // marginRight: gridSize * 1.5,
  // borderRight: `solid 1px ${color}`

  // Adds separator after site name.
  '&::after': {
    marginLeft: gridSize * 3,
    marginRight: gridSize * 1.5,
    content: '""',
    display: 'inline-block',
    width: '1px',
    height: gridSize * 3,
    backgroundColor: color,
    opacity: 0.2,
  },
});

export const siteNameSkeletonCSS = (theme: NavigationTheme) => ({
  ...siteNameCSS(theme),
  ...skeletonCSS(theme),
  width: gridSize * 3,
});

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
