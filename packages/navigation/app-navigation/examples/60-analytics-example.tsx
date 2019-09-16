import React, { Fragment } from 'react';
import {
  AnalyticsListener,
  AnalyticsContext,
  useAnalyticsEvents_experimental,
} from '@atlaskit/analytics-next';
import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { DefaultAppSwitcher } from './shared/AppSwitcher';
import { DefaultCreate } from './shared/Create';
import { DefaultHelp } from './shared/Help';
import { mockEndpoints } from './shared/mock-atlassian-switcher-endpoints';
import {
  mockBuiltInNotifications,
  BuiltInNotifications,
} from './shared/Notifications';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultProfile } from './shared/Profile';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { AppNavigation, PrimaryButton } from '../src';

mockEndpoints('jira');
mockBuiltInNotifications();

const AnalyticsExample = () => {
  const { createAnalyticsEvent } = useAnalyticsEvents_experimental();
  const AnalyticsEventGenerator = (target: string, element?: string) =>
    createAnalyticsEvent({
      action: `click ${target}`,
      actionSubject: `Navigation ${target} ${element ? element : 'button'}`,
    });

  const DashboardsContent = () => (
    <Fragment>
      <DropdownItemGroup>
        <DropdownItem
          onClick={() => {
            AnalyticsEventGenerator('system_dashboard', 'Dropdown').fire(
              'atlaskit',
            );
          }}
        >
          System Dashboard
        </DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup>
        <DropdownItem
          onClick={() => {
            AnalyticsEventGenerator('view_all_dashboards', 'Dropdown').fire(
              'atlaskit',
            );
          }}
        >
          View all dashboards
        </DropdownItem>
      </DropdownItemGroup>
    </Fragment>
  );

  const PrimaryItems = [
    <PrimaryButton
      onClick={(...args: any[]) => {
        AnalyticsEventGenerator('home').fire('atlaskit');
      }}
      text="Home"
    />,
    <PrimaryButton
      onClick={(...args: any[]) => {
        AnalyticsEventGenerator('projects').fire('atlaskit');
      }}
      text="Projects"
    />,
    <PrimaryButton
      onClick={(...args: any[]) => {
        const IssuesAnalyticsEvent = createAnalyticsEvent({
          action: 'click issues',
        });
        IssuesAnalyticsEvent.fire('atlaskit');
      }}
      text="Issues & Filters"
    />,
    <PrimaryButton
      dropdownContent={DashboardsContent}
      onClick={(...args: any[]) => {
        const DashboardAnalyticsEvent = createAnalyticsEvent({
          action: 'click dashboards',
        });
        DashboardAnalyticsEvent.fire('atlaskit');
        console.log('Dashboards click', ...args);
      }}
      text="Dashboards"
    />,
  ];

  return (
    <AnalyticsListener
      channel="atlaskit"
      onEvent={({ context }) => console.log('Event context:', context)}
    >
      <AnalyticsContext data={{ panel: 'app-navigation' }}>
        <AppNavigation
          primaryItems={PrimaryItems}
          renderAppSwitcher={DefaultAppSwitcher}
          renderCreate={DefaultCreate}
          renderHelp={DefaultHelp}
          renderNotifications={BuiltInNotifications}
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
