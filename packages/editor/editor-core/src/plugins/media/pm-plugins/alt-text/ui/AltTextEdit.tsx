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
import { ALT_TEXT_ACTION } from '../../../../analytics/types/media-events';
import {
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
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
};

export type AltTextEditComponentState = {
  showClearTextButton: boolean;
  value?: string;
};

export class AltTextEditComponent extends React.Component<
  Props & InjectedIntlProps & WithAnalyticsEventsProps,
  AltTextEditComponentState
> {
  state = {
    showClearTextButton: Boolean(this.props.value),
    value: this.props.value,
  };

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
            onBlur={this.onBlurHandler}
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

  onBlurHandler = () => {
    const { value } = this.props;

    this.setState(prevState => {
      if (!prevState.value && value) {
        this.fireAnalyticsEvent(ALT_TEXT_ACTION.ADDED);
      }
      if (prevState.value && !value) {
        this.fireAnalyticsEvent(ALT_TEXT_ACTION.CLEARED);
      }
      if (prevState.value && prevState.value !== value) {
        this.fireAnalyticsEvent(ALT_TEXT_ACTION.EDITED);
      }
      return {
        value: value,
      };
    });
  };

  private fireAnalyticsEvent(actionType: ALT_TEXT_ACTION) {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const analyticsEvent = createAnalyticsEvent({
        action: actionType,
        actionSubject: ACTION_SUBJECT.MEDIA,
        actionSubjectId: ACTION_SUBJECT_ID.MEDIA,
        eventType: EVENT_TYPE.UI,
      });
      analyticsEvent.fire();
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
