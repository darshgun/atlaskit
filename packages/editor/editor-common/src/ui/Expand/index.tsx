import * as React from 'react';
import styled from 'styled-components';
import { colors, gridSize, fontSize } from '@atlaskit/theme';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tooltip from '@atlaskit/tooltip';
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl';

import {
  akEditorSelectedBorder,
  akEditorSelectedBorderBoldSize,
  akEditorSwoopCubicBezier,
  blockNodesVerticalMargin,
} from '../../styles';

export const messages = defineMessages({
  expandNode: {
    id: 'fabric.editor.expandNode',
    defaultMessage: 'Expand content',
    description: 'Expand the node',
  },
  collapseNode: {
    id: 'fabric.editor.collapseNode',
    defaultMessage: 'Collapse content',
    description: 'Collapse the node',
  },
  expandDefaultTitle: {
    id: 'fabric.editor.expandDefaultTitle',
    defaultMessage: 'Click here to expand...',
    description: 'Placeholder text for an expand node',
  },
  expandPlaceholderText: {
    id: 'fabric.editor.expandPlaceholder',
    defaultMessage: 'Give this expand a title...',
    description: 'Placeholder text for an expand node title input field',
  },
});

export const LAYOUT_OFFSET = 17;
const BORDER_RADIUS = gridSize() / 2;

interface StyleProps {
  collapsed?: boolean;
  editable?: boolean;
  'data-node-type'?: 'expand' | 'nestedExpand';
  'data-title'?: string;
}

const Container = styled.div<StyleProps>`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ collapsed }) => (collapsed ? 'transparent' : colors.N40A)};
  border-radius: ${BORDER_RADIUS}px;
  margin: ${props =>
    `${!props.editable ? blockNodesVerticalMargin : 0}rem ${
      // Only only these margins if the expand isn't editable
      // and is the root level expand.
      props['data-node-type'] === 'expand' && !props.editable
        ? `-${LAYOUT_OFFSET}px`
        : `0`
    } 0`};

  padding: ${gridSize}px;
  cursor: pointer;

  &:hover {
    border: 1px solid ${colors.N50A};
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

  .expand-title-input,
  .nestedExpand-title-input {
    outline: none;
    border: none;
    font-size: ${fontSize}px;
    line-height: 1.714;
    font-weight: normal;
    color: ${colors.N200A};
    background: transparent;
    display: flex;
    flex: 1;
    padding: 0;

    width: calc(100% - ${gridSize() * 6}px);
    position: absolute;
    top: ${gridSize}px;

    &::placeholder {
      opacity: 0.6;
      color: ${colors.N200A};
    }
  }
`;

const TitleContainerStyles = `
  padding: 0;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: ${fontSize}px;
  width: 100%;
  color: ${colors.N200};
  overflow: hidden;
  cursor: pointer;

  /* TODO: Fix outline for keyboard navigation */
  &:focus {
    outline: 0;
  }
`;

const TitleContainerButton = styled.button`
  ${TitleContainerStyles}
`;

const TitleContainerDiv = styled.div`
  ${TitleContainerStyles}
`;

const Icon = styled.div<StyleProps>`
  cursor: pointer;
  display: flex;
  color: ${colors.N90};
  border-radius: ${BORDER_RADIUS}px;
  width: 24px;
  height: 24px;

  &:hover {
    background: ${colors.N30A};
  }

  svg {
    ${({ collapsed }) => !collapsed && `transform: rotate(90deg);`}
    transition: 0.2s ${akEditorSwoopCubicBezier};
  }
`;

const ContentContainer = styled.div<StyleProps>`
  ${({ collapsed }) => {
    return `
      padding: ${
        collapsed ? 0 : gridSize()
      }px ${gridSize()}px 0px ${gridSize() * 4 - gridSize() / 2}px;

      ${!!collapsed &&
        `
        .expand-content-wrapper, .nestedExpand-content-wrapper {
          /* We visually hide the content here to preserve the content during copy+paste */
          position: absolute;
          height: 1px; 
          width: 1px;
          overflow: hidden;
          clip: rect(1px, 1px, 1px, 1px);
          white-space: nowrap;
        }
      `}
      `;
  }};
`;

const TooltipWrapper = styled.div`
  width: 24px;
  height: 24px;
`;

export interface ExpandProps {
  title: string;
  nodeType: 'expand' | 'nestedExpand';
  renderTitle: React.ReactNode;
  renderContent: React.ReactNode;
  onContainerClick?: (event: React.SyntheticEvent) => void;
  editable?: boolean;
}

function Expand({
  title,
  nodeType,
  renderTitle,
  renderContent,
  onContainerClick,
  editable = false,
  intl,
}: ExpandProps & InjectedIntlProps) {
  const [collapsed, setCollapsed] = React.useState(!editable);
  const label = intl.formatMessage(
    collapsed ? messages.expandNode : messages.collapseNode,
  );

  const TitleContainer = editable ? TitleContainerDiv : TitleContainerButton;

  return (
    <Container
      data-node-type={nodeType}
      data-title={title}
      collapsed={collapsed}
      editable={editable}
      onClick={onContainerClick}
    >
      <TitleContainer
        onClick={(e: React.SyntheticEvent) => {
          e.stopPropagation();
          setCollapsed(!collapsed);
        }}
        aria-label={label}
        contentEditable={false}
      >
        <Tooltip content={label} position="top" tag={TooltipWrapper}>
          <Icon collapsed={collapsed} role={editable ? 'button' : undefined}>
            <ChevronRightIcon label={label} />
          </Icon>
        </Tooltip>
        {renderTitle}
      </TitleContainer>
      <ContentContainer collapsed={collapsed}>{renderContent}</ContentContainer>
    </Container>
  );
}

export default injectIntl(Expand);
