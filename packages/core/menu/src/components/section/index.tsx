/** @jsx jsx */
import { jsx } from '@emotion/core';
import { menuGroupCSS, sectionCSS } from './styles';
import { SectionProps, MenuGroupProps } from '../types';

export const MenuGroup = ({ maxHeight, testId, ...rest }: MenuGroupProps) => (
  <div css={menuGroupCSS(maxHeight)} data-testid={testId} {...rest} />
);

export const Section = ({
  isScrollable,
  hasSeparator,
  testId,
  ...rest
}: SectionProps) => (
  <div
    css={sectionCSS(isScrollable, hasSeparator)}
    data-testid={testId}
    {...rest}
  />
);
