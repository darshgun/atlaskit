/** @jsx jsx */
import { gridSize } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { useTheme } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';
import { createButtonSkeletonCSS, createIconSkeletonCSS } from './styles';

export const CreateSkeleton = () => {
  const theme = useTheme();
  return (
    <Fragment>
      <div css={createButtonSkeletonCSS(theme)} />
      <IconButtonSkeleton
        css={createIconSkeletonCSS}
        size={gridSize() * 3.25}
      />
    </Fragment>
  );
};
