/** @jsx jsx */

import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const truncate = (width: string = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

const ItemGroupTitleSize = 11;
export const ItemGroupTitle = styled.div`
  color: ${colors.N200};
  font-size: ${ItemGroupTitleSize}px;
  line-height: ${(gridSize() * 2) / ItemGroupTitleSize};
  font-weight: 600;
  padding-bottom: ${gridSize()}px;
  ${truncate()}
`;

export const RelatedArticlesContainer = styled.div`
  padding-bottom: ${2 * gridSize()}px;
  position: relative;
`;

export const ToggleShowMoreArticles = styled.a`
  padding-top: ${gridSize()}px;
  display: inline-block;
  cursor: pointer;
`;

/**
 * Loading styled-components
 */
export const LoadignRelatedArticleSection = styled.div`
  margin-top: 1.5rem;
`;

export const LoadignRelatedArticleList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const LoadignRelatedArticleListItem = styled.li`
  margin-top: 1rem;
  display: inline-block;
  width: 100%;

  & > div {
    display: inline-block;
  }
`;

export const LoadignRelatedArticleListItemText = styled.div`
  width: calc(100% - (40px + 0.5rem));
  margin-left: 0.5rem;
`;
