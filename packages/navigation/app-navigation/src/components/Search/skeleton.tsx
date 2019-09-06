/** @jsx jsx */
import { gridSize } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { IconButtonSkeleton } from '../IconButton/skeleton';
import {
  searchIconSkeletonCSS,
  searchInputContainerCSS,
  searchInputSkeletonCSS,
} from './styles';

export const SearchSkeleton = () => {
  return (
    <Fragment>
      <div css={searchInputContainerCSS}>
        <div css={searchInputSkeletonCSS} />
      </div>
      <IconButtonSkeleton
        css={searchIconSkeletonCSS}
        marginRight={5}
        size={gridSize() * 3.25}
      />
    </Fragment>
  );
};
