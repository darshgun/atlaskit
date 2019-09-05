import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AtlassianSwitcherProps } from '../components/atlassian-switcher';

import { prefetch } from './prefetch';
import { render } from './render';
import { resolveDependencies } from './resolve-dependencies';

export const prepareAtlassianSwitcher = (
  switcherProps: AtlassianSwitcherProps,
  analyticsListener: (event: UIAnalyticsEvent, channel?: string) => void,
) => {
  if (!analyticsListener) {
    throw new Error('Atlassian switcher: Missing analytics listener');
  }

  resolveDependencies();

  return {
    prefetch: () => prefetch(switcherProps),
    renderAt: (container: HTMLElement) => {
      render(switcherProps, analyticsListener, container);
    },
  };
};
