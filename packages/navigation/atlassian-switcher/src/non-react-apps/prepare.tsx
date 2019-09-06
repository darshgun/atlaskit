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

  let hasPrefetched = false;

  return {
    prefetch: () => {
      if (hasPrefetched) {
        return;
      }
      prefetch(switcherProps);
      hasPrefetched = true;
    },
    renderAt: (container: HTMLElement) => {
      return render(switcherProps, analyticsListener, container);
    },
  };
};
