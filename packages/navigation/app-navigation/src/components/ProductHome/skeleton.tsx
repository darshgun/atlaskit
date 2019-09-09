/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  containerSkeletonCSS,
  productIconSkeletonCSS,
  productLogoSkeletonCSS,
} from './styles';

export const ProductHomeSkeleton = () => (
  <div css={containerSkeletonCSS}>
    <div css={productLogoSkeletonCSS} />
    <div css={productIconSkeletonCSS} />
  </div>
);
