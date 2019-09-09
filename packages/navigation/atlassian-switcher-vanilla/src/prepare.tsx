import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AtlassianSwitcherProps, prefetch } from '@atlaskit/atlassian-switcher';
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
