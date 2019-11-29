import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { fontSize, fontSizeSmall } from '@atlaskit/theme/constants';
import {
  N800,
  N0,
  N200,
  N20,
  N30,
  subtleHeading,
  subtleText,
} from '@atlaskit/theme/colors';
import { CSSObject } from '@emotion/core';

const gridSize = gridSizeFn();

const buttonOverrides = {
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
};
const anchorOverrides = {
  color: 'currentColor',
};
const customItemOverrides = {
  color: 'currentColor',
};

const disabledStyles = {
  cursor: 'not-allowed',
  '&, &:hover, &:focus, &:active': {
    backgroundColor: N0,
    color: N200,
  },
};

const selectedStyles = {
  color: N800,
  backgroundColor: N20,
  textDecoration: 'none',
};

const baseItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  padding: `${gridSize}px ${gridSize * 1.5}px`,
  cursor: 'pointer',
  fontSize: fontSize(),
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  '&:hover': {
    color: N800,
    backgroundColor: N20,
    textDecoration: 'none',
  },
  '&:focus': {
    boxShadow: 'rgb(76, 154, 255) 0px 0px 0px 2px inset',
    outline: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    color: N800,
    backgroundColor: N30,
  },
  '::-moz-focus-inner': {
    border: 0,
  },
  ...(isSelected && selectedStyles),
  ...(isDisabled && disabledStyles),
});

export const itemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  ...buttonOverrides,
  ...baseItemCSS(isDisabled, isSelected),
});

/* Item subcomponents */
export const contentCSS = {
  flexGrow: 1,
  textAlign: 'left',
  overflow: 'hidden',
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  lineHeight: `${(gridSize * 2) / fontSize()}`,
} as CSSObject;

export const truncateCSS = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as CSSObject;

export const elemBeforeCSS = {
  display: 'flex',
  flexShrink: 0,
  marginRight: gridSize,
};
export const elemAfterCSS = {
  display: 'flex',
  flexShrink: 0,
  marginLeft: gridSize,
};
export const descriptionCSS = {
  textAlign: 'left',
  color: subtleText(),
  fontSize: fontSizeSmall(),
} as CSSObject;
export const contentCSSWrapper = {
  display: 'flex',
  alignItems: 'center',
};

/* Item variations */
export const linkItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  ...anchorOverrides,
  ...baseItemCSS(isDisabled, isSelected),
});

export const customItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  ...customItemOverrides,
  ...baseItemCSS(isDisabled, isSelected),
});

export const itemHeadingCSS = {
  textTransform: 'uppercase',
  fontSize: fontSizeSmall(),
  fontWeight: 500,
  color: subtleHeading(),
  marginLeft: gridSize / 2,
  marginTop: gridSize,
} as CSSObject;

export const skeletonHeadingItemCSS = {
  ...itemHeadingCSS,
  padding: gridSize / 2,
  '&::after': {
    backgroundColor: N20,
    height: gridSize * 1.75,
    margin: `${gridSize / 2}px 0`,
    width: `calc(20% - ${gridSize / 2}px)`,
    borderRadius: 3,
    display: 'block',
    content: '""',
  },
} as CSSObject;

export const itemSkeletonCSS = (
  hasAvatar?: boolean,
  hasIcon?: boolean,
  width?: string | number,
): CSSObject => ({
  ...itemCSS(false, false),
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',

  // Stagger alternate skeleton items if no width is passed
  ...(!width && {
    '&:nth-child(1n)::after': {
      flexBasis: '70%',
    },
    '&:nth-child(2n)::after': {
      flexBasis: '50%',
    },
    '&:nth-child(3n)::after': {
      flexBasis: '60%',
    },
    '&:nth-child(4n)::after': {
      flexBasis: '90%',
    },
    '&:nth-child(5n)::after': {
      flexBasis: '35%',
    },
    '&:nth-child(6n)::after': {
      flexBasis: '77%',
    },
  }),

  // Icon and Avatar styles
  ...((hasAvatar || hasIcon) && {
    '&::before': {
      content: '""',
      backgroundColor: N20,
      marginRight: gridSize,
      width: gridSize * 3,
      height: gridSize * 3,
      borderRadius: hasAvatar ? '100%' : 3,
    },
  }),

  // Skeleton text
  '&::after': {
    content: '""',
    backgroundColor: N20,
    height: gridSize * 1.75,
    borderRadius: 3,
    flexBasis: '100%' || width,
  },
});

/* Item Group */
export const menuGroupCSS = (maxHeight?: string | number): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  maxHeight,
});

export const sectionCSS = (
  isScrollable?: boolean,
  hasSeparator?: boolean,
): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  ...(isScrollable
    ? {
        flexShrink: 1,
        overflow: 'auto',
      }
    : { flexShrink: 0 }),
  ...(hasSeparator && { borderTop: `1px solid ${N30}` }),
});
