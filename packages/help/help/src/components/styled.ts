/** @jsx jsx */
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const HEADER_HEIGHT = gridSize() * 6;
export const FOOTER_HEIGHT = gridSize() * 6;

export const truncate = (width: string = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

export const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Section = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

type HelpBodyProps = {
  isArticleVisible?: boolean;
};

export const HelpBody = styled.div<HelpBodyProps>`
  flex-grow: 1;
  overflow: auto;
  min-height: 0;
  position: relative;
`;

type DefaultContentProps = {
  isArticleVisible?: boolean;
};

export const DefaultContent = styled.div<DefaultContentProps>`
  height: ${props => (props.isArticleVisible ? '100%' : 'auto')};
  overflow: auto;
`;

const FOOTER_BORDER_TOP = 2;
export const HelpFooter = styled.div`
  padding: ${gridSize()}px 0;
  box-sizing: border-box;
  background-color: ${colors.N10};
  border-top: ${FOOTER_BORDER_TOP}px solid ${colors.N30};
  justify-content: space-between;
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
