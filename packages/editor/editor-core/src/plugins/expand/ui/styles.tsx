import styled, { css } from 'styled-components';
import { colors, gridSize, fontSize } from '@atlaskit/theme';
import {
  blockNodesVerticalMargin,
  akEditorExpandLayoutOffset,
} from '@atlaskit/editor-common';

export const Input = styled.input`
  outline: none;
  border: none;
  font-size: ${fontSize}px;
  line-height: 1.714;
  font-weight: normal;
  color: ${colors.N200};
  background: transparent;
  display: flex;
  flex: 1;
  padding: 0 0 0 ${gridSize() / 2}px;

  &::placeholder {
    opacity: 0.6;
  }
`;

export const Content = styled.div`
  cursor: text;
`;

export const expandStyles = css`
  .expandView-content-wrap,
  .nestedExpandView-content-wrap {
    margin-top: ${blockNodesVerticalMargin}rem;
  }

  .ProseMirror > .expandView-content-wrap {
    margin-left: -${akEditorExpandLayoutOffset}px;
    margin-right: -${akEditorExpandLayoutOffset}px;
  }
`;
