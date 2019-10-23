import * as React from 'react';
import styled from 'styled-components';
import { gridSize, fontSize } from '@atlaskit/theme';
import {
  Expand as CommonExpand,
  expandMessages,
} from '@atlaskit/editor-common';
import { injectIntl, InjectedIntlProps } from 'react-intl';

const Title = styled.span`
  outline: none;
  border: none;
  font-size: ${fontSize}px;
  line-height: 1.714;
  font-weight: normal;
  display: flex;
  flex: 1;
  margin: 0;
  padding: 0 0 0 ${gridSize() / 2}px;
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
  return (
    <CommonExpand
      title={title}
      nodeType={nodeType}
      renderTitle={
        <Title>
          {title || intl.formatMessage(expandMessages.expandDefaultTitle)}
        </Title>
      }
      renderContent={children}
    />
  );
}

export default injectIntl(Expand);
