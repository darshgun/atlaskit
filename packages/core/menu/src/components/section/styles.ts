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
): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  padding: `${gridSize * 1.5}px 0`,
  ...(isScrollable
    ? {
        flexShrink: 1,
        overflow: 'auto',
      }
    : { flexShrink: 0 }),
  ...(hasSeparator && { borderTop: `2px solid ${N30}` }),
});
