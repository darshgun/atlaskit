import { css } from 'styled-components';
import { fontSize } from '@atlaskit/theme';
import { akEditorTableCellMinWidth } from '../consts';

export const expandStyles = css`
  .ProseMirror {
    .expandView-content-wrap,
    .nestedExpandView-content-wrap {
      font-size: ${fontSize()}px;
      min-width: ${akEditorTableCellMinWidth}px;
    }
  }
`;
