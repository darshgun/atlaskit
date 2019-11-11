import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { fontSize, fontSizeSmall } from '@atlaskit/theme/constants';
import {
  N800,
  N0,
  N200,
  N20,
  N30,
  subtleHeading,
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

const disabledStyles = {
  cursor: 'not-allowed',
  '&, &:hover, &:focus, &:active': {
    backgroundColor: N0,
    color: N200,
  },
};

const baseItemCSS = (isDisabled: boolean): CSSObject => ({
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
  ...(isDisabled && disabledStyles),
});

export const itemCSS = (isDisabled: boolean): CSSObject => ({
  ...buttonOverrides,
  ...baseItemCSS(isDisabled),
});

/* Item subcomponents */
export const contentCSS = {
  flexGrow: 1,
  textAlign: 'left',
  overflow: 'hidden',
  outline: 'none',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'flex',
  flexDirection: 'column',
  lineHeight: `${(gridSize * 2) / fontSize()}`,
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
  color: '#343434',
  fontSize: fontSizeSmall(),
} as CSSObject;
export const contentCSSWrapper = {
  display: 'flex',
  alignItems: 'center',
};

/* Item variations */
export const linkItemCSS = (isDisabled: boolean): CSSObject => ({
  ...anchorOverrides,
  ...baseItemCSS(isDisabled),
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
  '&::after': {
    backgroundColor: N20,
    height: gridSize * 1.5,
    padding: gridSize / 2,
    margin: `${gridSize / 2}px 0`,
    width: `calc(30% - ${gridSize / 2}px)`,
    display: 'block',
    content: '""',
  },
} as CSSObject;

export const itemSkeletonCSS = {
  ...itemCSS,
  pointerEvents: 'none',
  '&::after': {
    backgroundColor: N20,
    height: gridSize * 2.5,
    padding: gridSize / 2,
    margin: gridSize / 2,
    width: `calc(100% - ${gridSize * 3})`,
    display: 'block',
    content: '""',
  },
} as CSSObject;

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
  ...(hasSeparator && { borderBottom: `1px solid ${N30}` }),
});
