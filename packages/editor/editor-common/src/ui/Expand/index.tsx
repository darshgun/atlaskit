import * as React from 'react';
import styled, { css } from 'styled-components';
import { colors, gridSize, fontSize } from '@atlaskit/theme';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tooltip from '@atlaskit/tooltip';
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl';

import {
  akEditorSelectedBorder,
  akEditorSelectedBorderSize,
  akEditorSwoopCubicBezier,
  blockNodesVerticalMargin,
  akLayoutGutterOffset,
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

const BORDER_RADIUS = gridSize() / 2;
const EXPAND_SELECTED_BACKGROUND = 'rgba(255, 255, 255, 0.6)';

export interface StyleProps {
  collapsed?: boolean;
  editable?: boolean;
  'data-node-type'?: 'expand' | 'nestedExpand';
  'data-title'?: string;
}

const ContainerStyles = css<StyleProps>`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ collapsed }) => (collapsed ? 'transparent' : colors.N40A)};
  border-radius: ${BORDER_RADIUS}px;
  min-height: 25px;
  background: ${({ collapsed }) =>
    collapsed ? 'transparent' : EXPAND_SELECTED_BACKGROUND};
  margin: ${props =>
    `${!props.editable ? blockNodesVerticalMargin : 0}rem ${
      // Only only these margins if the expand isn't editable
      // and is the root level expand.
      props['data-node-type'] === 'expand' && !props.editable
        ? `-${akLayoutGutterOffset}px`
        : `0`
    } 0`};

  transition: background 0.3s ${akEditorSwoopCubicBezier};
  padding: ${gridSize}px;
  cursor: pointer;

  &:hover {
    border: 1px solid ${colors.N50A};
    background: ${EXPAND_SELECTED_BACKGROUND};
  }

  &.ProseMirror-selectednode {
    border-color: transparent;
    background: ${colors.B50};
    box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorSelectedBorder};
  }

  &.danger {
    border-color: transparent;
    background: ${colors.R50};
    box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${colors.R300};
  }

  td > &:first-child {
    margin-top: 0;
  }
`;

const ContentStyles = css<StyleProps>`
  ${({ collapsed }) => {
    return `
    padding-top: ${collapsed ? 0 : gridSize()}px;
    padding-right: ${gridSize()}px;
    padding-left: ${gridSize() * 4 - gridSize() / 2}px;
    overflow: hidden;

    ${
      !!collapsed
        ? `
      .expand-content-wrapper, .nestedExpand-content-wrapper {
        /* We visually hide the content here to preserve the content during copy+paste */
        position: absolute;
        height: 1px; 
        width: 1px;
        overflow: hidden;
        clip: rect(1px, 1px, 1px, 1px);
        white-space: nowrap;
      }
    `
        : ''
    }
    `;
  }};
`;

const TitleInputStyles = `
  outline: none;
  border: none;
  font-size: ${fontSize()}px;
  line-height: 1.714;
  font-weight: normal;
  color: ${colors.N200A};
  background: transparent;
  display: flex;
  flex: 1;
  padding: 0 0 0 ${gridSize() / 2}px;
  width: 100%;

  &::placeholder {
    opacity: 0.6;
    color: ${colors.N200A};
  }
`;

const TitleContainerStyles = `
  padding: 0;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: ${fontSize()}px;
  width: 100%;
  color: ${colors.N300A};
  overflow: hidden;
  cursor: pointer;

  /* TODO: Fix outline for keyboard navigation */
  &:focus {
    outline: 0;
  }
`;

export const sharedExpandStyles = {
  TitleInputStyles,
  TitleContainerStyles,
  ContainerStyles,
  ContentStyles,
};

const Container = styled.div<StyleProps>`
  ${ContainerStyles}
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
  ${ContentStyles};
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
            <ChevronRightIcon label={label} primaryColor={colors.N80A} />
          </Icon>
        </Tooltip>
        {renderTitle}
      </TitleContainer>
      <ContentContainer collapsed={collapsed}>{renderContent}</ContentContainer>
    </Container>
  );
}

export default injectIntl(Expand);
