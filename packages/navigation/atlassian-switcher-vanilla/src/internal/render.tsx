import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import AtlassianSwitcher from '@atlaskit/atlassian-switcher';
import { AtlassianSwitcherProps } from '@atlaskit/atlassian-switcher/types';

export const render = (
  switcherProps: AtlassianSwitcherProps,
  analyticsListener: (event: UIAnalyticsEvent, channel?: string) => void,
  container: HTMLElement,
) => {
  ReactDOM.render(
    <IntlProvider>
      <AnalyticsListener channel="*" onEvent={analyticsListener}>
        <AtlassianSwitcher {...switcherProps} />
      </AnalyticsListener>
    </IntlProvider>,
    container,
  );

  return () => {
    ReactDOM.unmountComponentAtNode(container);
  };
};
