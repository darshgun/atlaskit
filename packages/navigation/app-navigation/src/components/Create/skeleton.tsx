/** @jsx jsx */
import { gridSize } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';
import { Fragment } from 'react';
import { IconButtonSkeleton } from '../IconButton/skeleton';
import { createButtonSkeletonCSS, createIconSkeletonCSS } from './styles';

export const CreateSkeleton = () => (
  <Fragment>
    <div css={createButtonSkeletonCSS} />
    <IconButtonSkeleton css={createIconSkeletonCSS} size={gridSize() * 3.25} />
  </Fragment>
);
