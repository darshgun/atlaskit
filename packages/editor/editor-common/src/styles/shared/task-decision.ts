import { css } from 'styled-components';
import { fontSize } from '@atlaskit/theme';
import { akEditorTableCellMinWidth } from '..';

export const tasksAndDecisionsStyles = css`
  .ProseMirror .taskItemView-content-wrap,
  .ProseMirror .decisionItemView-content-wrap {
    font-size: ${fontSize()}px;
    min-width: ${akEditorTableCellMinWidth}px;
  }

  div[data-task-list-local-id] {
    margin: 12px 0 0 0;
  }

  div[data-task-list-local-id]:first-child {
    margin-top: 0;
  }
`;
