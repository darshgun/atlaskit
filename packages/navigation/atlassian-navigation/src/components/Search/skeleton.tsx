/** @jsx jsx */
import { gridSize } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { useTheme } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';
import {
  searchIconSkeletonCSS,
  searchInputContainerCSS,
  searchInputSkeletonCSS,
} from './styles';

export const SearchSkeleton = () => {
  const theme = useTheme();

  return (
    <Fragment>
      <div css={searchInputContainerCSS}>
        <div css={searchInputSkeletonCSS(theme)} />
      </div>
      <IconButtonSkeleton
        css={searchIconSkeletonCSS}
        marginRight={5}
        size={gridSize() * 3.25}
      />
    </Fragment>
  );
};
