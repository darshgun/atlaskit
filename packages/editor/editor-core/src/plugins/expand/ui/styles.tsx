import { css } from 'styled-components';
import {
  blockNodesVerticalMargin,
  akEditorExpandLayoutOffset,
} from '@atlaskit/editor-common';

export const expandStyles = css`
  .expandView-content-wrap,
  .nestedExpandView-content-wrap {
    margin-top: ${blockNodesVerticalMargin}rem;
  }

  .ProseMirror > .expandView-content-wrap {
    margin-left: -${akEditorExpandLayoutOffset}px;
    margin-right: -${akEditorExpandLayoutOffset}px;
  }

  .expand-content-dom-wrapper,
  .nestedExpand-content-dom-wrapper {
    position: relative;
  }
`;
