import React from 'react';
import { KeyboardEvent } from 'react';
import { EditorView } from 'prosemirror-view';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import { messages } from '../messages';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Button from '../../../../floating-toolbar/ui/Button';
import PanelTextInput from '../../../../../ui/PanelTextInput';
import * as keymaps from '../../../../../keymaps';
import { closeMediaAltTextMenu, updateAltText } from '../commands';

export const CONTAINER_WIDTH_IN_PX = 350;
const SupportText = styled.p`
  color: ${colors.N100};
  font-size: 12px;
  padding: 0 24px;
  line-height: 20px;
`;

const AltTextEditWrapper = styled.div`
  width: ${CONTAINER_WIDTH_IN_PX}px;
  display: flex;
  flex-direction: column;
  padding: 4px;
`;

const InputWrapper = styled.section`
  display: flex;
  line-height: 0;
  padding: 0;
  align-items: center;
`;

const Separator = styled.div`
  background: ${colors.N30};
  width: 100%;
  height: 1px;
`;

type Props = {
  view: EditorView;
};

class AltTextEditComponent extends React.Component<Props & InjectedIntlProps> {
  render() {
    const { intl } = this.props;

    const backButtonMessage = intl.formatMessage(messages.back);
    const backButtonMessageComponent = keymaps.renderTooltipContent(
      backButtonMessage,
      keymaps.escape,
      'Esc',
    );

    return (
      <AltTextEditWrapper>
        <InputWrapper>
          <Button
            title={intl.formatMessage(messages.back)}
            icon={
              <ChevronLeftLargeIcon label={intl.formatMessage(messages.back)} />
            }
            tooltipContent={backButtonMessageComponent}
            onClick={this.closeMediaAltTextMenu}
          />
          <PanelTextInput
            placeholder={intl.formatMessage(messages.placeholder)}
            defaultValue=""
            onBlur={this.dispatchCancelEvent}
            onCancel={this.dispatchCancelEvent}
            onSubmit={this.updateAltText}
            autoFocus
          />
        </InputWrapper>
        <Separator />
        <SupportText>{intl.formatMessage(messages.supportText)}</SupportText>
      </AltTextEditWrapper>
    );
  }

  private closeMediaAltTextMenu = () => {
    const { view } = this.props;
    closeMediaAltTextMenu(view.state, view.dispatch);
  };

  private dispatchCancelEvent = (event: KeyboardEvent) => {
    const { view } = this.props;

    // We need to pass down the ESCAPE keymap
    // because when we focus on the Toolbar, Prosemirror blur,
    // making all keyboard shortcuts not working
    view.someProp('handleKeyDown', (fn: any) => fn(view, event));
  };

  private updateAltText = (newAltText: string) => {
    const { view } = this.props;

    updateAltText(newAltText)(view.state, view.dispatch);
  };
}

export default injectIntl(AltTextEditComponent);
