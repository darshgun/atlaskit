/** @jsx jsx */
import { jsx } from '@emotion/core';

import { getIconButtonSkeletonCSS } from './styles';
import { IconButtonSkeletonProps } from './types';

export const IconButtonSkeleton = (props: IconButtonSkeletonProps) => (
  <div className={props.className} css={getIconButtonSkeletonCSS(props)} />
);
