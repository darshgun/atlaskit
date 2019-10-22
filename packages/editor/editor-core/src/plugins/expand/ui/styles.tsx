import styled, { css } from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

import {
  akEditorSelectedBorder,
  akEditorSelectedBorderBoldSize,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-common';

const LAYOUT_OFFSET = 17;
const BORDER_RADIUS = gridSize() / 2;
const SWOOP_CUBIC_BEZIER = `cubic-bezier(0.15, 1, 0.3, 1)`;

export const Container = styled.div<{ collapsed: boolean }>`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ collapsed }) => (collapsed ? 'transparent' : colors.N40)};
  border-radius: ${BORDER_RADIUS}px;
  margin: ${gridSize() - 1}px 0 0;
  padding: ${gridSize}px;

  &:hover {
    border: 1px solid ${colors.N50};
  }

  .ProseMirror-selectednode > & {
    border-color: transparent;
    box-shadow: 0 0 0 ${akEditorSelectedBorderBoldSize}px
      ${akEditorSelectedBorder};
  }

  .expandView-content-wrap.danger > &,
  .nestedExpandView-content-wrap.danger > & {
    border-color: transparent;
    box-shadow: 0 0 0 ${akEditorSelectedBorderBoldSize}px ${colors.R300};
  }
  cursor: pointer;
`;

export const TitleButton = styled.button`
  padding: 0;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 1rem;
  color: ${colors.N200};
  cursor: pointer;
  min-width: 24px;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

export const Icon = styled.div<{ collapsed: boolean }>`
  cursor: pointer;
  display: flex;
  color: ${colors.N90};
  border-radius: ${BORDER_RADIUS}px;
  width: 100%;

  &:hover {
    background: ${colors.N30A};
  }

  svg {
    ${({ collapsed }) => !collapsed && `transform: rotate(90deg);`}
    transition: 0.2s ${SWOOP_CUBIC_BEZIER};
  }
`;

export const Input = styled.input`
  outline: none;
  border: none;
  font-size: 1em;
  line-height: 1.714;
  font-weight: normal;
  color: ${colors.N500};
  display: flex;
  flex: 1;
`;

export const Content = styled.div`
  cursor: text;
  padding: ${gridSize}px ${gridSize}px ${gridSize}px
    ${gridSize() * 4 - gridSize() / 2}px;
`;

export const expandStyles = css`
  .expandView-content-wrap,
  .nestedExpandView-content-wrap {
    margin-top: ${blockNodesVerticalMargin}rem;
    margin-bottom: ${blockNodesVerticalMargin}rem;

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .expandView-content-wrap {
    margin-left: -${LAYOUT_OFFSET}px;
    margin-right: -${LAYOUT_OFFSET}px;
  }
`;
