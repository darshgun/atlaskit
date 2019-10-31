import { css } from 'styled-components';
import { colors } from '@atlaskit/theme';
import {
  blockNodesVerticalMargin,
  akEditorExpandLayoutOffset,
  sharedExpandStyles,
} from '@atlaskit/editor-common';

import { expandClassNames } from './class-names';

const EXPAND_SELECTED_BACKGROUND = 'rgba(255, 255, 255, 0.6)';

export const expandStyles = css`
  .${expandClassNames.prefix} {
    ${sharedExpandStyles.ContainerStyles}
    margin-top: ${blockNodesVerticalMargin}rem;

    td > & {
      margin-top: 0;
    }

    .${expandClassNames.iconContainer} svg {
      transform: rotate(90deg);
    }
  }

  .ProseMirror .${expandClassNames.prefix}:not(.${expandClassNames.type(
  'nestedExpand',
)}) {
    margin-left: -${akEditorExpandLayoutOffset}px;
    margin-right: -${akEditorExpandLayoutOffset}px;
  }

  .${expandClassNames.content} {
    ${sharedExpandStyles.ContentStyles}
  }

  .${expandClassNames.titleInput} {
    ${sharedExpandStyles.TitleInputStyles}
  }

  .${expandClassNames.titleContainer} {
    ${sharedExpandStyles.TitleContainerStyles}
  }

  .${expandClassNames.expanded} {
    background: ${EXPAND_SELECTED_BACKGROUND};
    border-color: ${colors.N40A};
  }

  .${expandClassNames.inputContainer} {
    width: 100%;
  }

  .${expandClassNames.prefix}:not(.${expandClassNames.expanded}) {
    .ak-editor-expand__content {
      position: absolute;
      height: 1px; 
      width: 1px;
      overflow: hidden;
      clip: rect(1px, 1px, 1px, 1px);
      white-space: nowrap;
    }

    .${expandClassNames.iconContainer} svg {
      transform: rotate(0deg);
    }

    &:not(.ProseMirror-selectednode):not(.danger) {
      background: transparent;
      border-color: transparent;

      &:hover {
        border-color: ${colors.N50A};
        background: ${EXPAND_SELECTED_BACKGROUND};
      }
    }

  }

  
`;
