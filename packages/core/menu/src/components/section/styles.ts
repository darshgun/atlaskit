import { CSSObject } from '@emotion/core';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { N30 } from '@atlaskit/theme/colors';

const gridSize = gridSizeFn();

export const menuGroupCSS = (maxHeight?: string | number): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  maxHeight,
});

export const sectionCSS = (
  isScrollable?: boolean,
  hasSeparator?: boolean,
): CSSObject => {
  const topBottomPadding = gridSize * 1.5;

  return {
    paddingTop: topBottomPadding,
    ...(isScrollable
      ? {
          flexShrink: 1,
          overflow: 'auto',
        }
      : { flexShrink: 0 }),
    ...(hasSeparator && { borderTop: `2px solid ${N30}` }),
    '&:focus': {
      // Since this element uses tab-index="-1" we need to turn the outline off.
      outline: 0,
    },
    '&::after': {
      // This pseudo element will add extra spacing so we get the illusion of a bottom padding.
      // Unfortunately using overflow hidden without this it is cut off short.
      // See: https://stackoverflow.com/questions/8981811/overflowhidden-ignoring-bottom-padding
      // for more information about this problem.
      content: "''",
      display: 'block',
      height: topBottomPadding,
    },
  };
};
