import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import * as colors from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { Transition } from 'react-transition-group';
import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left';
import Button from '@atlaskit/button';

import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

import { BackButtonContainer } from './styled';
import { TRANSITION_DURATION_MS, TRANSITION_STATUS } from '../constants';
import { withAnalyticsEvents, withAnalyticsContext } from '../../analytics';
import { messages } from '../../messages';
import { Analytics } from '../../model/Analytics';

import { withHelp, HelpContextInterface } from '../HelpContext';

const buttonTheme = {
  color: colors.N90,
};

const defaultStyle = {
  transition: `left ${TRANSITION_DURATION_MS}ms, opacity ${TRANSITION_DURATION_MS}ms`,
  left: `${gridSize() * 3}px`,
  opacity: 0,
};

const transitionStyles: { [id: string]: React.CSSProperties } = {
  entered: { left: `${gridSize()}px`, opacity: 1 },
  exited: { left: `${gridSize()}px`, opacity: 0 },
};

export interface Props {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
}

const BackButton = (
  props: Props & HelpContextInterface & Analytics & InjectedIntlProps,
) => {
  const {
    help,
    intl: { formatMessage },
    createAnalyticsEvent,
  } = props;

  const handleButtonBackClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (help.onBackButtonClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'clicked',
      });
      help.onBackButtonClick(event, analyticsEvent);
    }

    help.navigateBack();
  };

  return (
    <Transition
      in={help.isBackbuttonVisible()}
      timeout={TRANSITION_DURATION_MS}
      mountOnEnter
      unmountOnExit
    >
      {(state: TRANSITION_STATUS) => (
        <BackButtonContainer
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          <Button
            onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
              if (state === 'entered') {
                handleButtonBackClick(event);
              }
            }}
            appearance="subtle"
            theme={(currentTheme: any, themeProps: any) => {
              const { buttonStyles, ...rest } = currentTheme(themeProps);
              return {
                buttonStyles: {
                  ...buttonStyles,
                  ...buttonTheme,
                },
                ...rest,
              };
            }}
            iconBefore={<ArrowleftIcon label="" size="medium" />}
          >
            {formatMessage(messages.help_panel_navigation_back)}
          </Button>
        </BackButtonContainer>
      )}
    </Transition>
  );
};

export default withAnalyticsContext({
  componentName: 'backButton',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(withHelp(injectIntl(BackButton))));
