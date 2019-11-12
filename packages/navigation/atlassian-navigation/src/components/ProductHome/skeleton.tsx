/** @jsx jsx */

import { Fragment } from 'react';
import { jsx } from '@emotion/core';
import { useTheme } from '../../theme';
import {
  containerSkeletonCSS,
  productIconSkeletonCSS,
  siteTitleSkeletonCSS,
  productLogoSkeletonCSS,
} from './styles';

export const ProductHomeSkeleton = ({
  showSiteName,
}: {
  showSiteName: boolean;
}) => {
  const theme = useTheme();

  return (
    <Fragment>
      <div css={containerSkeletonCSS}>
        <div css={productLogoSkeletonCSS(theme)} />
        <div css={productIconSkeletonCSS(theme)} />
      </div>
      {showSiteName && <div css={siteTitleSkeletonCSS(theme)} />}
    </Fragment>
  );
};
