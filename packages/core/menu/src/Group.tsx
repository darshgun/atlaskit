/** @jsx jsx */
import { jsx } from '@emotion/core';
import { menuGroupCSS, sectionCSS } from './styles';

export const MenuGroup = ({ maxHeight, ...rest }) => (
  <div css={menuGroupCSS(maxHeight)} {...rest} />
);
export const Section = ({ isScrollable, shouldShowSeparator, ...rest }) => (
  <div css={sectionCSS(isScrollable, shouldShowSeparator)} {...rest} />
);
