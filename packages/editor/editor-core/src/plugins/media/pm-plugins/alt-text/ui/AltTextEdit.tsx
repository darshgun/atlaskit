import React from 'react';
import { KeyboardEvent } from 'react';
import { EditorView } from 'prosemirror-view';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { messages } from '../messages';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Button from '../../../../floating-toolbar/ui/Button';
import PanelTextInput from '../../../../../ui/PanelTextInput';
import * as keymaps from '../../../../../keymaps';
import { closeMediaAltTextMenu, updateAltText } from '../commands';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  fireAnalyticsEvent,
  ACTION,
  MediaAltTextActionType,
  FireAnalyticsCallback,
} from '../../../../analytics';

export const CONTAINER_WIDTH_IN_PX = 350;
const SupportText = styled.p`
  color: ${colors.N100};
  font-size: 12px;
  padding-right: 24px;
  padding-left: 28px;
  padding-top: 12px;
  padding-bottom: 12px;
  line-height: 20px;
  border-top: 1px solid ${colors.N30};
  margin: 0;
`;

const Container = styled.div`
  width: ${CONTAINER_WIDTH_IN_PX}px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  line-height: 2;
`;

const InputWrapper = styled.section`
  display: flex;
  line-height: 0;
  padding: 0;
  align-items: center;
  margin-bottom: 4px;
`;

const BackButtonWrapper = styled.div`
  display: flex;
  margin-right: 4px;
`;

const ClearText = styled.span`
  color: ${colors.N80};
`;

type Props = {
  view: EditorView;
  value?: string;
} & InjectedIntlProps &
  WithAnalyticsEventsProps;

export type AltTextEditComponentState = {
  showClearTextButton: boolean;
};

export class AltTextEditComponent extends React.Component<
  Props,
  AltTextEditComponentState
> {
  private fireCustomAnalytics?: FireAnalyticsCallback;
  state = {
    showClearTextButton: Boolean(this.props.value),
  };

  constructor(props: Props) {
    super(props);

    const { createAnalyticsEvent } = props;
    this.fireCustomAnalytics = fireAnalyticsEvent(createAnalyticsEvent);
  }

  prevValue: string | undefined;

  componentDidMount() {
    this.prevValue = this.props.value;
  }

  componentWillUnmount() {
    this.fireAnalytics(ACTION.CLOSED);
    if (!this.prevValue && this.props.value) {
      this.fireAnalytics(ACTION.ADDED);
    }
    if (this.prevValue && !this.props.value) {
      this.fireAnalytics(ACTION.CLEARED);
    }
    if (this.prevValue && this.prevValue !== this.props.value) {
      this.fireAnalytics(ACTION.EDITED);
    }
  }

  render() {
    const {
      intl: { formatMessage },
      value,
    } = this.props;
    const { showClearTextButton } = this.state;

    const backButtonMessage = formatMessage(messages.back);
    const backButtonMessageComponent = keymaps.renderTooltipContent(
      backButtonMessage,
      keymaps.escape,
      'Esc',
    );

    return (
      <Container>
        <InputWrapper>
          <BackButtonWrapper>
            <Button
              title={formatMessage(messages.back)}
              icon={
                <ChevronLeftLargeIcon label={formatMessage(messages.back)} />
              }
              tooltipContent={backButtonMessageComponent}
              onClick={this.closeMediaAltTextMenu}
            />
          </BackButtonWrapper>
          <PanelTextInput
            placeholder={formatMessage(messages.placeholder)}
            defaultValue={value ? value : ''}
            onCancel={this.dispatchCancelEvent}
            onChange={this.handleOnChange}
            onSubmit={this.closeMediaAltTextMenu}
            autoFocus
          />
          {showClearTextButton && (
            <Button
              title={formatMessage(messages.clear)}
              icon={
                <ClearText>
                  <CrossCircleIcon label={formatMessage(messages.clear)} />
                </ClearText>
              }
              tooltipContent={formatMessage(messages.clear)}
              onClick={this.handleClearText}
            />
          )}
        </InputWrapper>
        <SupportText>{formatMessage(messages.supportText)}</SupportText>
      </Container>
    );
  }

  private closeMediaAltTextMenu = () => {
    const { view } = this.props;
    closeMediaAltTextMenu(view.state, view.dispatch);
  };

  private fireAnalytics(actionType: MediaAltTextActionType) {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent && this.fireCustomAnalytics) {
      this.fireCustomAnalytics({
        payload: {
          action: actionType,
          actionSubject: ACTION_SUBJECT.MEDIA,
          actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
          eventType: EVENT_TYPE.TRACK,
        },
      });
    }
  }

  private dispatchCancelEvent = (event: KeyboardEvent) => {
    const { view } = this.props;

    // We need to pass down the ESCAPE keymap
    // because when we focus on the Toolbar, Prosemirror blur,
    // making all keyboard shortcuts not working
    view.someProp('handleKeyDown', (fn: any) => fn(view, event));
  };

  private updateAltText = (newAltText: string) => {
    const { view } = this.props;
    const newValue = newAltText.length === 0 ? null : newAltText;
    updateAltText(newValue)(view.state, view.dispatch);
  };

  private handleOnChange = (newAltText: string) => {
    this.setState({
      showClearTextButton: Boolean(newAltText),
    });
    this.updateAltText(newAltText);
  };

  private handleClearText = () => {
    this.handleOnChange('');
  };
}

export default withAnalyticsEvents()(injectIntl(AltTextEditComponent));
