import * as React from 'react';
import styled from 'styled-components';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { gridSize, fontSize } from '@atlaskit/theme';
import {
  Expand as CommonExpand,
  expandMessages,
} from '@atlaskit/editor-common';
import { AnalyticsEventPayload, PLATFORM, MODE } from '../analytics/events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics/enums';

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
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
}

function Expand({
  title,
  children,
  nodeType,
  intl,
  fireAnalyticsEvent,
}: ExpandProps & InjectedIntlProps) {
  return (
    <CommonExpand
      title={title}
      nodeType={nodeType}
      onToggle={(collapsed: boolean) => {
        if (fireAnalyticsEvent) {
          fireAnalyticsEvent({
            action: ACTION.TOGGLE_EXPAND,
            actionSubject:
              nodeType === 'expand'
                ? ACTION_SUBJECT.EXPAND
                : ACTION_SUBJECT.NESTED_EXPAND,
            attributes: {
              platform: PLATFORM.WEB,
              mode: MODE.RENDERER,
              expanded: !collapsed,
            },
            eventType: EVENT_TYPE.TRACK,
          });
        }
      }}
      renderTitle={
        <Title>
          {title || intl.formatMessage(expandMessages.expandDefaultTitle)}
        </Title>
      }
      renderContent={
        <div className={`${nodeType}-content-wrapper`}>{children}</div>
      }
    />
  );
}

export default injectIntl(Expand);
