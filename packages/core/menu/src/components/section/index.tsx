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
    // NOTE: Firefox allows elements that have "overflow: auto" to gain focus (as if it had tab-index="0")
    // We have made a deliberate choice to leave this behaviour as is.
    css={sectionCSS(isScrollable, hasSeparator)}
    data-testid={testId}
    {...rest}
  />
);
