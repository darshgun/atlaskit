import * as React from 'react';
import Mention from '../src/components/Mention';
import { AnalyticsListener } from '@atlaskit/analytics';
import {
  AnalyticsListener as AnalyticsListenerNext,
  AnalyticsContext as AnalyticsContextNext,
} from '@atlaskit/analytics-next';
import debug from '../src/util/logger';
import { onMentionEvent } from '../example-helpers/index';
import { mockMentionData as mentionData } from '../__tests__/_test-helpers';

const padding = { padding: '10px' };

function listenerHandler(eventName: string, eventData: Object) {
  debug(`[analytics] listenerHandler event: ${eventName} `, eventData);
}

const listenerHandlerDefaultNext = e => {
  debug(
    '[analytics-next default] AnalyticsListener event - payload:',
    e.payload,
    ' context: ',
    e.context,
  );
};

const listenerHandlerNext = e => {
  debug(
    '[analytics-next] AnalyticsListener event - payload:',
    e.payload,
    ' context: ',
    e.context,
  );
};

const handler = (
  mentionId: string,
  text: string,
  event?: any,
  analytics?: any,
) => {
  console.log('#handler - ', text, ' ', event, ' - analytics: ', analytics);
};

export default function Example() {
  return (
    <div>
      <div style={padding}>
        <AnalyticsListenerNext onEvent={listenerHandlerDefaultNext}>
          <AnalyticsListenerNext
            onEvent={listenerHandlerNext}
            channel="fabric-elements"
          >
            <AnalyticsListener onEvent={listenerHandler} matchPrivate={true}>
              <AnalyticsContextNext data={{ analyticsContextTest: true }}>
                <Mention
                  {...mentionData}
                  accessLevel={'CONTAINER'}
                  onClick={handler}
                  onMouseEnter={onMentionEvent}
                  onMouseLeave={onMentionEvent}
                />
              </AnalyticsContextNext>
            </AnalyticsListener>
          </AnalyticsListenerNext>
        </AnalyticsListenerNext>
      </div>
      <div style={padding}>
        <Mention
          {...mentionData}
          isHighlighted={true}
          onClick={onMentionEvent}
          onMouseEnter={onMentionEvent}
          onMouseLeave={onMentionEvent}
        />
      </div>
      <div style={padding}>
        <Mention
          {...mentionData}
          accessLevel={'NONE'}
          onClick={onMentionEvent}
          onMouseEnter={onMentionEvent}
          onMouseLeave={onMentionEvent}
        />
      </div>
    </div>
  );
}
