import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { fontSize, fontSizeSmall } from '@atlaskit/theme/constants';
import { N800, N20, N30, subtleHeading } from '@atlaskit/theme/colors';
import { CSSObject } from '@emotion/core';

const gridSize = gridSizeFn();

const buttonOverrides = {
  backgroundColor: 'unset',
  border: 'none',
  outline: 'none',
};
const anchorOverrides = {
  color: 'currentColor',
};

const baseItemCSS = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: `${gridSize}px ${gridSize * 1.5}px`,
  cursor: 'pointer',
  fontSize: fontSize(),
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
};

export const itemCSS = {
  ...buttonOverrides,
  ...baseItemCSS,
} as CSSObject;

/* Item subcomponents */
export const contentCSS = {
  flexGrow: 1,
  textAlign: 'left',
  overflow: 'hidden',
  outline: 'none',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: `${16 / fontSize()}`,
} as CSSObject;
export const elemBeforeCSS = { flexShrink: 0, marginRight: gridSize };
export const elemAfterCSS = { flexShrink: 0, marginLeft: gridSize };
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
export const linkItemCSS = {
  ...anchorOverrides,
  ...baseItemCSS,
} as CSSObject;

export const itemHeadingCSS = {
  textTransform: 'uppercase',
  fontSize: fontSizeSmall(),
  fontWeight: 500,
  color: subtleHeading(),
  marginLeft: 4,
  marginTop: 8,
} as CSSObject;

export const skeletonHeadingItemCSS = {
  ...itemHeadingCSS,
  '&::after': {
    backgroundColor: N20,
    height: 12,
    padding: 4,
    width: 'calc(30% - 8px)',
    display: 'block',
    content: '""',
  },
} as CSSObject;

export const itemSkeletonCSS = {
  ...itemCSS,
  pointerEvents: 'none',
  '&::after': {
    backgroundColor: N20,
    height: 20,
    padding: 4,
    width: 'calc(100% - 8px)',
    display: 'block',
    content: '""',
  },
} as CSSObject;

/* Item Group */
export const menuGroupCSS = (maxHeight?: string | number): CSSObject => ({
  overflow: 'auto',
  maxHeight,
});

export const sectionCSS = (
  isScrollable?: boolean,
  shouldShowSeparator?: boolean,
): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  ...(isScrollable
    ? {
        flexShrink: 1,
        overflow: 'auto',
      }
    : { flexShrink: 0 }),
  ...(shouldShowSeparator && { borderBottom: `1px solid ${N30}` }),
});
