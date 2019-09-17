/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useTheme } from '../../theme';
import {
  containerSkeletonCSS,
  productIconSkeletonCSS,
  productLogoSkeletonCSS,
} from './styles';

export const ProductHomeSkeleton = () => {
  const theme = useTheme();

  return (
    <div css={containerSkeletonCSS}>
      <div css={productLogoSkeletonCSS(theme)} />
      <div css={productIconSkeletonCSS(theme)} />
    </div>
  );
};
