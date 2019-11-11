/** @jsx jsx */
import { jsx } from '@emotion/core';
import { menuGroupCSS, sectionCSS } from './styles';
import { SectionProps, MenuGroupProps } from './types';

export const MenuGroup = ({ maxHeight, ...rest }: MenuGroupProps) => (
  <div css={menuGroupCSS(maxHeight)} {...rest} />
);
export const Section = ({
  isScrollable,
  hasSeparator,
  ...rest
}: SectionProps) => (
  <div css={sectionCSS(isScrollable, hasSeparator)} {...rest} />
);
