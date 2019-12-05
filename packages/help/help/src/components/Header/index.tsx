import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../../messages';

import { withHelp, HelpContextInterface } from '../HelpContext';
import CloseButton from './CloseButton';
import BackButton from './BackButton';

import { HeaderContainer, HeaderTitle } from './styled';

export interface Props {}

export const HelpContent = (
  props: Props & InjectedIntlProps & HelpContextInterface,
) => {
  const {
    intl: { formatMessage },
  } = props;

  return (
    <HeaderContainer>
      <BackButton />
      <HeaderTitle>{formatMessage(messages.help_panel_header)}</HeaderTitle>
      <CloseButton />
    </HeaderContainer>
  );
};

export default withHelp(injectIntl(HelpContent));
