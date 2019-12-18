/** @jsx jsx */

import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';

export const truncate = (width: string = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

export const RelatedArticlesContainer = styled.div`
  position: relative;
`;

export const ToggleShowMoreArticles = styled.a`
  padding: ${gridSize()}px;
  display: inline-block;
  cursor: pointer;
`;

/**
 * Loading styled-components
 */
export const LoadignRelatedArticleSection = styled.div`
  margin-top: ${gridSize()}px;
`;

export const LoadignRelatedArticleList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const LoadignRelatedArticleListItem = styled.li`
  display: block;
  width: 100%;
  padding: ${gridSize()}px;
  margin-bottom: ${gridSize() * 2}px;
`;
