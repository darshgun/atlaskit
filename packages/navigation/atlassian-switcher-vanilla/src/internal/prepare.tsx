import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AtlassianSwitcherProps } from '@atlaskit/atlassian-switcher/types';
import { prefetch } from '@atlaskit/atlassian-switcher/prefetch';
import { render } from './render';

export const prepareAtlassianSwitcher = (
  switcherProps: AtlassianSwitcherProps,
  analyticsListener: (event: UIAnalyticsEvent, channel?: string) => void,
) => {
  if (!analyticsListener) {
    throw new Error('Atlassian switcher: Missing analytics listener');
  }

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
