/** @jsx jsx */
import { jsx } from '@emotion/core';
import { badgeContainerCSS, containerCSS } from './styles';
import { BadgeProps } from './types';

export const BadgeContainer = (props: BadgeProps) => {
  const { badge: Badge, children } = props;
  return (
    <div css={containerCSS}>
      {children}
      <div css={badgeContainerCSS}>
        <Badge />
      </div>
    </div>
  );
};
