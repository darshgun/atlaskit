import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { fontSize, fontSizeSmall } from '@atlaskit/theme/constants';
import { N800, N20, N30 } from '@atlaskit/theme/colors';

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
};

/* Item subcomponents */
export const contentCSS = {
  flexGrow: 1,
  textAlign: 'left',
  overflow: 'hidden',
  outline: 'none',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: `${16 / fontSize()}`,
};
export const elemBeforeCSS = { flexGrow: 0, marginRight: gridSize };
export const elemAfterCSS = { flexGrow: 0, marginLeft: gridSize };
export const descriptionCSS = {
  textAlign: 'left',
  color: '#343434',
  fontSize: fontSizeSmall(),
};
export const contentCSSWrapper = {
  display: 'flex',
  alignItems: 'center',
};

/* Item variations */
export const linkItemCSS = {
  ...anchorOverrides,
  ...baseItemCSS,
};

export const itemHeadingCSS = {
  textTransform: 'uppercase',
};

export const itemSkeletonCSS = {
  ...itemCSS,
};

/* Item Group */
export const menuGroupCSS = (maxHeight?: string | number) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  maxHeight,
});

export const sectionCSS = (
  isScrollable?: boolean,
  shouldShowSeparator?: boolean,
) => ({
  display: 'flex',
  flexDirection: 'column',
  ...(isScrollable
    ? {
        flexShrink: 1,
        overflow: 'auto',
      }
    : { flexShrink: 0 }),
  ...(shouldShowSeparator && { borderBottom: '1px solid' }),
});
