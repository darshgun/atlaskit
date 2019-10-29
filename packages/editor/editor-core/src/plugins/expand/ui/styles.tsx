import { css } from 'styled-components';
import {
  blockNodesVerticalMargin,
  akEditorExpandLayoutOffset,
  sharedExpandStyles,
} from '@atlaskit/editor-common';

export const expandStyles = css`
  .ProseMirror > .ak-editor-expand {
    ${sharedExpandStyles.ContainerStyles}

    margin-top: ${blockNodesVerticalMargin}rem;
    margin-left: -${akEditorExpandLayoutOffset}px;
    margin-right: -${akEditorExpandLayoutOffset}px;
  }

  .ak-editor-expand__title-input-wrapper {
    width: 100%;
  }

  .ak-editor-expand__content {
    ${sharedExpandStyles.ContentStyles}
  }

  .ak-editor-expand__title-input {
    ${sharedExpandStyles.TitleInputStyles}
  }

  .ak-editor-expand__title-container {
    ${sharedExpandStyles.TitleContainerStyles}
  }
`;
