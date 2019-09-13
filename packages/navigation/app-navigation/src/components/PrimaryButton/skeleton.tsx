/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useTheme } from '../../theme';
import { primaryButtonSkeletonCSS } from './styles';

export const PrimaryButtonSkeleton = () => {
  const theme = useTheme();

  return <div css={primaryButtonSkeletonCSS(theme)} />;
};
