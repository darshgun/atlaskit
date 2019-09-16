/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

interface ArticleContainerProps {
  isSearchVisible: boolean;
}

export const ArticleContainer = styled.div<ArticleContainerProps>`
  padding: ${gridSize() * 2}px ${gridSize() * 3}px ${gridSize() * 2}px
    ${gridSize() * 3}px;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: #ffffff;
  left: 100%;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
`;

export const SelectedIcon = styled.div`
  margin-top: 0.3em;
`;

export const ArticleContentInner = styled.div`
  padding-bottom: ${2 * gridSize()}px;
  position: relative;
`;

export const ArticleContentTitle = styled.div`
  padding-bottom: ${2 * gridSize()}px;
`;

export const ArticleRateText = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: ${colors.N200};
  line-height: ${gridSize() * 2}px;
  position: relative;
  display: inline-block;
`;

export const ArticleRateAnswerWrapper = styled.div`
  padding-top: ${gridSize() * 2}px;
`;

export const ToggleShowMoreArticles = styled.a`
  padding-top: ${gridSize()}px;
  display: inline-block;
  cursor: pointer;
`;
