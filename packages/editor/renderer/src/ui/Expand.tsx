import * as React from 'react';
import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tooltip from '@atlaskit/tooltip';
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl';

import {
  akEditorSelectedBorder,
  akEditorSelectedBorderBoldSize,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-common';

const messages = defineMessages({
  expand: {
    id: 'fabric.editor.expand',
    defaultMessage: 'Expand',
    description: 'Expand the node',
  },
  collapse: {
    id: 'fabric.editor.collapse',
    defaultMessage: 'Collapse',
    description: 'Collapse the node',
  },
});

export const LAYOUT_OFFSET = 17;
const BORDER_RADIUS = gridSize() / 2;
// Move to common
const SWOOP_CUBIC_BEZIER = `cubic-bezier(0.15, 1, 0.3, 1)`;

interface StyleProps {
  collapsed?: boolean;
  'data-node-type'?: 'expand' | 'nestedExpand';
  'data-title'?: string;
}

export const Container = styled.div<StyleProps>`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ collapsed }) => (collapsed ? 'transparent' : colors.N40)};
  border-radius: ${BORDER_RADIUS}px;
  margin: ${props =>
    `${
      props['data-node-type'] === 'expand'
        ? `${blockNodesVerticalMargin}rem -${LAYOUT_OFFSET}px`
        : `0 0`
    } 0`};

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
`;

export const TitleContainer = styled.button<StyleProps>`
  padding: ${gridSize() / 2}px ${gridSize}px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 1rem;
  width: 100%;
  color: ${colors.N200};
  overflow: hidden;
  cursor: pointer;

  /* TODO: Fix outline for keyboard navigation */
  &:focus {
    outline: 0;
  }
`;

export const Icon = styled.div<StyleProps>`
  cursor: pointer;
  display: flex;
  color: ${colors.N90};
  border-radius: ${BORDER_RADIUS}px;

  &:hover {
    background: ${colors.N30A};
  }

  svg {
    ${({ collapsed }) => !collapsed && `transform: rotate(90deg);`}
    transition: 0.2s ${SWOOP_CUBIC_BEZIER};
  }
`;

export const Title = styled.p`
  outline: none;
  border: none;
  font-size: 1rem;
  line-height: 1.714;
  font-weight: normal;
  display: flex;
  flex: 1;
  margin: 0;
  padding: 0 0 0 ${gridSize() / 2}px;
`;

const Content = styled.div<StyleProps>`
  padding: ${gridSize() / 2}px ${gridSize() * 2}px ${gridSize() * 2}px
    ${gridSize() * 5 - gridSize() / 2}px
    ${({ collapsed }) =>
      collapsed &&
      `
      /* We visually hide the content here to preserve the content during copy+paste */
      position: absolute;
      height: 1px; 
      width: 1px;
      overflow: hidden;
      clip: rect(1px, 1px, 1px, 1px);
      white-space: nowrap;
    `};
`;

export interface ExpandProps {
  title: string;
  nodeType: 'expand' | 'nestedExpand';
  children: React.ReactNode;
}

function Expand({
  title,
  children,
  nodeType,
  intl,
}: ExpandProps & InjectedIntlProps) {
  const [collapsed, setCollapsed] = React.useState(true);
  const label = intl.formatMessage(
    collapsed ? messages.expand : messages.collapse,
  );

  return (
    <Container
      data-node-type={nodeType}
      data-title={title}
      collapsed={collapsed}
    >
      <TitleContainer
        onClick={() => setCollapsed(!collapsed)}
        aria-label={`${label} ${title}`}
      >
        <Tooltip content={label} position="top">
          <Icon collapsed={collapsed}>
            <ChevronRightIcon label={`${label} ${title}`} />
          </Icon>
        </Tooltip>
        <Title>{title}</Title>
      </TitleContainer>
      <Content collapsed={collapsed}>{children}</Content>
    </Container>
  );
}

export default injectIntl(Expand);
