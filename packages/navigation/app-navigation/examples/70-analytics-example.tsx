import React from 'react';
import {
  AnalyticsListener,
  AnalyticsContext,
  useAnalyticsEvents_experimental,
} from '@atlaskit/analytics-next';
import { DefaultAppSwitcher } from './shared/AppSwitcher';
import { DefaultCreate } from './shared/Create';
import { DefaultHelp } from './shared/Help';
import { DefaultNotifications } from './shared/Notifications';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultProfile } from './shared/Profile';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { AppNavigation, PrimaryButton, PrimaryButtonProps } from '../src';
import { useOverflowStatus } from '../src/controllers/overflow';
import { DropdownItem } from '@atlaskit/dropdown-menu';

const NavigationButton = (props: PrimaryButtonProps) => {
  const { isVisible } = useOverflowStatus();
  if (isVisible) {
    return <PrimaryButton {...props} />;
  } else {
    return <DropdownItem>{props.children}</DropdownItem>;
  }
};

const AnalyticsExample = () => {
  const { createAnalyticsEvent } = useAnalyticsEvents_experimental();
  const AnalyticsEventGenerator = (target: string, element?: string) =>
    createAnalyticsEvent({
      action: `click ${target}`,
      actionSubject: `Navigation ${target} ${element ? element : 'button'}`,
    });

  const primaryItems = [
    <NavigationButton
      onClick={(...args: any[]) => {
        AnalyticsEventGenerator('projects').fire('atlaskit');
      }}
    >
      Projects
    </NavigationButton>,
    <NavigationButton
      onClick={(...args: any[]) => {
        const IssuesAnalyticsEvent = createAnalyticsEvent({
          action: 'click issues',
        });
        IssuesAnalyticsEvent.fire('atlaskit');
      }}
    >
      Filters
    </NavigationButton>,
    <NavigationButton
      onClick={(...args: any[]) => {
        const DashboardAnalyticsEvent = createAnalyticsEvent({
          action: 'click dashboards',
        });
        DashboardAnalyticsEvent.fire('atlaskit');
        console.log('Dashboards click', ...args);
      }}
    >
      Dashboards
    </NavigationButton>,
    <NavigationButton
      onClick={(...args: any[]) => {
        AnalyticsEventGenerator('apps').fire('atlaskit');
      }}
    >
      Apps
    </NavigationButton>,
  ];

  return (
    <AnalyticsListener
      channel="atlaskit"
      onEvent={({ context }) => console.log('Event context:', context)}
    >
      <AnalyticsContext data={{ panel: 'app-navigation' }}>
        <AppNavigation
          primaryItems={primaryItems}
          renderAppSwitcher={DefaultAppSwitcher}
          renderCreate={DefaultCreate}
          renderHelp={DefaultHelp}
          renderNotifications={DefaultNotifications}
          renderProductHome={DefaultProductHome}
          renderProfile={DefaultProfile}
          renderSearch={DefaultSearch}
          renderSettings={DefaultSettings}
        />
      </AnalyticsContext>
    </AnalyticsListener>
  );
};

export default AnalyticsExample;
