import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import AtlassianSwitcher, {
  AtlassianSwitcherProps,
} from '../components/atlassian-switcher';

export const render = (
  switcherProps: AtlassianSwitcherProps,
  analyticsListener: (event: UIAnalyticsEvent, channel?: string) => void,
  container: HTMLElement,
) =>
  ReactDOM.render(
    <IntlProvider>
      <AnalyticsListener channel="*" onEvent={analyticsListener}>
        <AtlassianSwitcher {...switcherProps} />
      </AnalyticsListener>
    </IntlProvider>,
    container,
  );
