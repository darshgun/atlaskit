import {
  AnalyticsEventPayloadWithChannel,
  editorAnalyticsChannel,
} from './index';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AnalyticsEventPayload } from './types';
import { EditorState, Transaction } from 'prosemirror-state';
import { Command } from '../../types';
import { InputRuleWithHandler } from '../../utils/input-rules';
import { analyticsPluginKey } from './plugin';
import { AnalyticsStep } from './analytics-step';
import { Step } from 'prosemirror-transform';

export type DispatchAnalyticsEvent = (payload: AnalyticsEventPayload) => void;
export type HigherOrderCommand = (command: Command) => Command;

function getAnalyticsState(
  editorState: EditorState,
): CreateUIAnalyticsEvent | null | undefined {
  return analyticsPluginKey.getState(editorState) as
    | CreateUIAnalyticsEvent
    | null
    | undefined;
}

export function addAnalytics(
  state: EditorState,
  tr: Transaction,
  payload: AnalyticsEventPayload,
  channel: string = editorAnalyticsChannel,
): Transaction {
  const createAnalyticsEvent = getAnalyticsState(state);

  if (createAnalyticsEvent) {
    const { storedMarks } = tr;
    tr.step(
      new AnalyticsStep(
        createAnalyticsEvent,
        [
          {
            payload,
            channel,
          },
        ],
        tr.selection.$from.pos, // We need to create the step based on a position, this prevent split history for relative changes.
      ),
    );
    // When you add a new step all the storedMarks are removed it
    if (storedMarks) {
      tr.setStoredMarks(storedMarks);
    }
  }

  return tr;
}

export function withAnalytics(
  payload:
    | AnalyticsEventPayload
    | ((state: EditorState) => AnalyticsEventPayload | undefined),
  channel?: string,
): HigherOrderCommand {
  return command => (state, dispatch, view) =>
    command(
      state,
      tr => {
        if (dispatch) {
          if (payload instanceof Function) {
            const dynamicPayload = payload(state);
            if (dynamicPayload) {
              dispatch(addAnalytics(state, tr, dynamicPayload, channel));
            }
          } else {
            dispatch(addAnalytics(state, tr, payload, channel));
          }
        }
      },
      view,
    );
}

export function ruleWithAnalytics(
  getPayload: (
    state: EditorState,
    match: string[],
    start: number,
    end: number,
  ) => AnalyticsEventPayload,
) {
  return (rule: InputRuleWithHandler) => {
    // Monkey patching handler to add analytics
    const handler = rule.handler;

    rule.handler = (
      state: EditorState,
      match,
      start,
      end,
    ): Transaction<any> | null => {
      let tr = handler(state, match, start, end);

      if (tr) {
        const payload = getPayload(state, match, start, end);
        tr = addAnalytics(state, tr, payload);
      }
      return tr;
    };
    return rule;
  };
}

export const fireAnalyticsEvent = (
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => ({
  payload,
  channel = editorAnalyticsChannel,
}: {
  payload: AnalyticsEventPayload;
  channel?: string;
}) => {
  return createAnalyticsEvent && createAnalyticsEvent(payload).fire(channel);
};

export function getAnalyticsEventsFromTransaction(
  tr: Transaction,
): AnalyticsEventPayloadWithChannel[] {
  return (tr.steps as Step[])
    .filter<AnalyticsStep>(
      (step: Step): step is AnalyticsStep => step instanceof AnalyticsStep,
    )
    .reduce<AnalyticsEventPayloadWithChannel[]>(
      (acc, step) => [...acc, ...step.analyticsEvents],
      [],
    );
}
