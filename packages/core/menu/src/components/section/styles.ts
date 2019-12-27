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
    display: 'flex',
    flexDirection: 'column',
    paddingTop: topBottomPadding,
    ...(isScrollable
      ? {
          flexShrink: 1,
          overflow: 'auto',
        }
      : { flexShrink: 0 }),
    ...(hasSeparator && { borderTop: `2px solid ${N30}` }),
    // In a scrollable container this after pseudo element will add extra spacing so we get the illusion
    // of a bottom padding - unfortunately using overflow hidden without this it cuts it off short.
    // See: https://stackoverflow.com/questions/8981811/overflowhidden-ignoring-bottom-padding
    // for more information about this problem.
    '&::after': {
      content: "''",
      flexShrink: 0,
      height: topBottomPadding,
    },
  };
};
