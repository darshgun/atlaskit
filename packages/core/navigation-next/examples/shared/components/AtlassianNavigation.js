// @flow

import {
  AtlassianNavigation,
  AppSwitcher,
  Create,
  Help,
  Notifications,
  ProductHome,
  Profile,
  Search,
} from '@atlaskit/atlassian-navigation';
import Avatar from '@atlaskit/avatar';
import { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { B400, Y300 } from '@atlaskit/theme/colors';
import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { getAvatarUrl } from './helpers/avatar-data-url';

const IssueKey = ({ children }) => (
  <span css={{ color: B400, marginRight: 8 }}>{children}</span>
);

const DropdownLink = props => {
  return (
    <DropdownItem
      linkComponent={({ className, children, href, onClick }) => (
        <Link className={className} to={href} onClick={onClick}>
          {children}
        </Link>
      )}
      onClick={() => console.log('clicked')}
      {...props}
    />
  );
};

const ProjectsContent = ({ closeDropdown }: any) => (
  <Fragment>
    <DropdownItemGroup title="Favourite Projects">
      <DropdownLink
        href="/projects/endeavour"
        elemBefore={<ShipIcon />}
        elemAfter={<StarFilledIcon primaryColor={Y300} />}
        onClick={closeDropdown}
      >
        Endeavour
      </DropdownLink>
    </DropdownItemGroup>
    <DropdownItemGroup title="Recent Projects">
      <DropdownLink
        href="/projects/endeavour"
        elemBefore={<ShipIcon />}
        elemAfter={<StarFilledIcon primaryColor={Y300} />}
        onClick={closeDropdown}
      >
        Endeavour
      </DropdownLink>
    </DropdownItemGroup>
    <hr />
    <DropdownLink href="/projects" onClick={closeDropdown}>
      View all projects
    </DropdownLink>
  </Fragment>
);

const IssuesContent = ({ closeDropdown }: any) => (
  <Fragment>
    <DropdownItemGroup title="Recent Issues">
      <DropdownLink
        href="/issues/nav-1"
        elemBefore={<Story16Icon />}
        onClick={closeDropdown}
      >
        <IssueKey>NAV-1</IssueKey>Add quick search
      </DropdownLink>
      <DropdownLink
        href="/issues/nav-2"
        elemBefore={<Bug16Icon />}
        onClick={closeDropdown}
      >
        <IssueKey>NAV-2</IssueKey>Dont re-render 1000 times
      </DropdownLink>
    </DropdownItemGroup>
    <DropdownItemGroup>
      <DropdownLink href="/issues/recent" onClick={closeDropdown}>
        View all recent issues
      </DropdownLink>
    </DropdownItemGroup>
    <DropdownItemGroup title="Filters">
      <DropdownLink href="/filters/my-open-issues" onClick={closeDropdown}>
        My open issues
      </DropdownLink>
      <DropdownLink href="/filters/reported-by-me" onClick={closeDropdown}>
        Reported by me
      </DropdownLink>
    </DropdownItemGroup>
  </Fragment>
);

const DashboardsContent = ({ closeDropdown }: any) => (
  <Fragment>
    <DropdownLink href="/" onClick={closeDropdown}>
      System Dashboard
    </DropdownLink>
    <DropdownLink href="/" onClick={closeDropdown}>
      View all dashboards
    </DropdownLink>
  </Fragment>
);

const primaryItems = [
  {
    dropdownContent: ProjectsContent,
    id: 'projects',
    text: 'Projects',
    onClick: () => {
      console.log('Projects clicked');
    },
  },
  {
    dropdownContent: IssuesContent,
    id: 'issues',
    text: 'Issues & Filters',
    onClick: () => {
      console.log('Issues clicked');
    },
  },
  {
    dropdownContent: DashboardsContent,
    id: 'dashboards',
    text: 'Dashboards',
    onClick: () => {
      console.log('Dashboards clicked');
    },
  },
];

const AppSwitcherContent = () => <div>App switcher</div>;

const onAppSwitcherClick = (...args: any[]) => {
  console.log('App switcher click', ...args);
};

const onAppSwitcherClose = (...args: any[]) => {
  console.log('App switcher close', ...args);
};

const onAppSwitcherDrawerCloseComplete = (...args: any[]) => {
  console.log('App switcher drawer close complete', ...args);
};

const AppSwitcherExample = () => (
  <AppSwitcher
    drawerContent={AppSwitcherContent}
    onClick={onAppSwitcherClick}
    onClose={onAppSwitcherClose}
    onDrawerCloseComplete={onAppSwitcherDrawerCloseComplete}
    tooltip="Switch to..."
  />
);

const onCreateClick = () => {
  console.log('Create click');
};

const CreateExample = () => <Create text="Create" onClick={onCreateClick} />;

const HelpContent = () => (
  <Fragment>
    <DropdownItemGroup title="Help">
      <DropdownItem>Atlassian Documentation</DropdownItem>
      <DropdownItem>Atlassian Community</DropdownItem>
      <DropdownItem>What's New</DropdownItem>
      <DropdownItem>Get Jira Mobile</DropdownItem>
      <DropdownItem>Keyboard shortcuts</DropdownItem>
      <DropdownItem>About Jira</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="Legal">
      <DropdownItem>Terms of use</DropdownItem>
      <DropdownItem>Privacy Policy</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

const onHelpClick = (...args: any[]) => {
  console.log('Help click', ...args);
};

const onHelpClose = (...args: any[]) => {
  console.log('Help close', ...args);
};

const HelpExample = () => (
  <Help
    dropdownContent={HelpContent}
    onClick={onHelpClick}
    onClose={onHelpClose}
    tooltip="Help"
  />
);

const badge = {
  appearance: 'important',
  count: 3,
  type: 'provided',
};

const NotificationsContent = () => <div>notifications</div>;

const onNotificationsClick = (...args: any[]) => {
  console.log('Notifications click', ...args);
};

const onNotificationsClose = (...args: any[]) => {
  console.log('Notifications close', ...args);
};

const onNotificationsDrawerCloseComplete = (...args: any[]) => {
  console.log('Notifications drawer close complete', ...args);
};

const NotificationsExample = () => (
  <Notifications
    badge={badge}
    drawerContent={NotificationsContent}
    onClick={onNotificationsClick}
    onClose={onNotificationsClose}
    onDrawerCloseComplete={onNotificationsDrawerCloseComplete}
    product="jira"
    tooltip="Notifications"
  />
);

const productHomeActiveStyle = {
  color: 'inherit',
};

const ProductHomeExample = () => (
  <NavLink activeStyle={productHomeActiveStyle} to="/">
    <ProductHome icon={JiraIcon} logo={JiraLogo} />
  </NavLink>
);

const avatarUrl = getAvatarUrl();

const ProfileContent = () => (
  <Fragment>
    <DropdownItemGroup title="JimJim">
      <DropdownItem>Profile</DropdownItem>
      <DropdownItem>Give feedback</DropdownItem>
      <DropdownItem>Personal settings</DropdownItem>
      <DropdownItem>My Reminders</DropdownItem>
      <DropdownItem>Log out</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

const onProfileClick = (...args: any[]) => {
  console.log('Profile click', ...args);
};

const onProfileClose = (...args: any[]) => {
  console.log('Profile close', ...args);
};

const ProfileExample = () => (
  <Profile
    avatar={<Avatar src={avatarUrl} />}
    dropdownContent={ProfileContent}
    onClick={onProfileClick}
    onClose={onProfileClose}
    tooltip="Your profile and settings"
  />
);

const SearchContent = () => <div>search</div>;

const onSearchClick = (...args: any[]) => {
  console.log('Search click', ...args);
};

const onSearchClose = (...args: any[]) => {
  console.log('Search close', ...args);
};

const onSearchDrawerCloseComplete = (...args: any[]) => {
  console.log('Search drawer close complete', ...args);
};

const SearchExample = () => (
  <Search
    drawerContent={SearchContent}
    onClick={onSearchClick}
    onClose={onSearchClose}
    onDrawerCloseComplete={onSearchDrawerCloseComplete}
    text="Search"
    tooltip="Search"
  />
);

const AppNavigationComponent = () => {
  return (
    <AtlassianNavigation
      primaryItems={primaryItems}
      renderAppSwitcher={AppSwitcherExample}
      renderCreate={CreateExample}
      renderHelp={HelpExample}
      renderNotifications={NotificationsExample}
      renderProductHome={ProductHomeExample}
      renderProfile={ProfileExample}
      renderSearch={SearchExample}
    />
  );
};

export default AppNavigationComponent;
