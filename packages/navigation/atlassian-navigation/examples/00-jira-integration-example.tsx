/** @jsx jsx */
import Avatar from '@atlaskit/avatar';
import Badge from '@atlaskit/badge';
import Drawer from '@atlaskit/drawer';
import Button from '@atlaskit/button';
import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import Popup from '@atlaskit/popup';
import { PopupProps } from '@atlaskit/popup/types';
import { jsx } from '@emotion/core';
import { Fragment, KeyboardEvent, useState } from 'react';

import { DefaultCreate } from './shared/Create';
import {
  AtlassianNavigation,
  AppSwitcher,
  Help,
  Notifications,
  PrimaryDropdownButton,
  ProductHome,
  Profile,
  Search,
  Settings,
} from '../src';
import { useOverflowStatus } from '../src/controllers/overflow';

const AppSwitcherDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      <AppSwitcher onClick={onClick} tooltip="Switch to..." />
      <Drawer isOpen={isOpen} onClose={onClose}>
        app switcher drawer
      </Drawer>
    </Fragment>
  );
};

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

const HelpDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      content={HelpContent}
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-end"
      trigger={triggerProps => (
        <Help onClick={onClick} tooltip="Help" {...triggerProps} />
      )}
    />
  );
};

const badge = () => <Badge appearance="important">3</Badge>;

const NotificationsDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Notifications badge={badge} onClick={onClick} tooltip="Notifications" />
      <Drawer isOpen={isOpen} onClose={onClose}>
        notifications drawer
      </Drawer>
    </Fragment>
  );
};

const avatarUrl =
  'data:image/png;base64,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';

const ProfileContent = () => (
  <Fragment>
    <DropdownItem>Give us feedback</DropdownItem>
    <DropdownItemGroup title="Jira">
      <DropdownItem>Settings</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="John Smith">
      <DropdownItem>Profile</DropdownItem>
      <DropdownItem>Account settings</DropdownItem>
      <DropdownItem>Logout</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      content={ProfileContent}
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-end"
      trigger={triggerProps => (
        <Profile
          icon={
            <Avatar src={avatarUrl} size="small" borderColor="transparent" />
          }
          onClick={onClick}
          tooltip="Your profile and settings"
          {...triggerProps}
        />
      )}
    />
  );
};

const linkCSS = {
  color: 'inherit',
  textDecoration: 'none',
  ':hover, :visited, :active': {
    color: 'inherit',
  },
};

const Icon = ({
  iconGradientStart,
  iconGradientStop,
  iconColor,
  textColor,
}: {
  iconGradientStart?: string;
  iconGradientStop?: string;
  iconColor?: string;
  textColor?: string;
}) => (
  <Button
    appearance="link"
    href="#"
    iconBefore={
      <JiraIcon
        iconGradientStart={iconGradientStart}
        iconGradientStop={iconGradientStop}
        iconColor={iconColor}
        textColor={textColor}
      />
    }
  />
);

const Logo = ({
  iconGradientStart,
  iconGradientStop,
  iconColor,
  textColor,
}: {
  iconGradientStart?: string;
  iconGradientStop?: string;
  iconColor?: string;
  textColor?: string;
}) => (
  <a css={linkCSS} href="#">
    <JiraLogo
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      iconColor={iconColor}
      textColor={textColor}
    />
  </a>
);

const ProductHomeExample = () => (
  <ProductHome icon={Icon} logo={Logo} siteTitle="Hello" />
);

const SearchDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Search onClick={onClick} text="Search..." tooltip="Search" />
      <Drawer isOpen={isOpen} onClose={onClose}>
        search drawer
      </Drawer>
    </Fragment>
  );
};

const SettingsDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Settings onClick={onClick} tooltip="Settings" />
      <Drawer isOpen={isOpen} onClose={onClose}>
        settings drawer
      </Drawer>
    </Fragment>
  );
};

const ProjectsContent = () => (
  <Fragment>
    <DropdownItemGroup title="Starred">
      <DropdownItem>Mobile Research</DropdownItem>
      <DropdownItem>IT Services</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="Recent">
      <DropdownItem>Engineering Leadership</DropdownItem>
      <DropdownItem>BAU</DropdownItem>
      <DropdownItem>Hardware Support</DropdownItem>
      <DropdownItem>New Features</DropdownItem>
      <DropdownItem>SAS</DropdownItem>
    </DropdownItemGroup>
    <DropdownItem>View all projects</DropdownItem>
  </Fragment>
);

const FiltersContent = () => (
  <Fragment>
    <DropdownItemGroup title="Starred">
      <DropdownItem>Assigned to me</DropdownItem>
      <DropdownItem>Created by me</DropdownItem>
      <DropdownItem>Updated recently</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="Recent">
      <DropdownItem>Engineering Leadership</DropdownItem>
      <DropdownItem>Viewed recently</DropdownItem>
      <DropdownItem>Resolved recently</DropdownItem>
      <DropdownItem>Done issues</DropdownItem>
    </DropdownItemGroup>
    <DropdownItem>View all filters</DropdownItem>
  </Fragment>
);

const DashboardsContent = () => (
  <Fragment>
    <DropdownItemGroup title="Starred">
      <DropdownItem>System dashboard</DropdownItem>
      <DropdownItem>Innovation week</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="Recent">
      <DropdownItem>Vanguard</DropdownItem>
      <DropdownItem>Pearformance</DropdownItem>
      <DropdownItem>Vertigo</DropdownItem>
    </DropdownItemGroup>
    <DropdownItem>View all dashboards</DropdownItem>
  </Fragment>
);

const AppsContent = () => (
  <Fragment>
    <DropdownItem>Portfolio</DropdownItem>
    <DropdownItem>Tempo timesheets</DropdownItem>
    <DropdownItem>Slack</DropdownItem>
    <DropdownItem>Invision</DropdownItem>
    <DropdownItemGroup>
      <DropdownItem>Explore apps</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

type PrimaryDropdownProps = {
  content: PopupProps['content'];
  text: string;
  isHighlighted?: boolean;
};

const PrimaryDropdown = (props: PrimaryDropdownProps) => {
  const { content, text, isHighlighted } = props;
  const { isVisible } = useOverflowStatus();
  const [isOpen, setIsOpen] = useState(false);

  if (!isVisible) {
    return <DropdownItem>{text}</DropdownItem>;
  }

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown') {
      setIsOpen(true);
    }
  };

  return (
    <Popup
      content={content}
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      trigger={triggerProps => (
        <PrimaryDropdownButton
          onClick={onClick}
          onKeyDown={onKeyDown}
          isHighlighted={isHighlighted}
          {...triggerProps}
        >
          {text}
        </PrimaryDropdownButton>
      )}
    />
  );
};

const primaryItems = [
  <PrimaryDropdown content={ProjectsContent} text="Projects" />,
  <PrimaryDropdown isHighlighted content={FiltersContent} text="Filters" />,
  <PrimaryDropdown content={DashboardsContent} text="Dashboards" />,
  <PrimaryDropdown content={AppsContent} text="Apps" />,
];

const JiraIntegrationExample = () => (
  <AtlassianNavigation
    primaryItems={primaryItems}
    renderAppSwitcher={AppSwitcherDrawer}
    renderCreate={DefaultCreate}
    renderHelp={HelpDropdown}
    renderNotifications={NotificationsDrawer}
    renderProductHome={ProductHomeExample}
    renderProfile={ProfileDropdown}
    renderSearch={SearchDrawer}
    renderSettings={SettingsDrawer}
    moreLabel="More"
  />
);

export default JiraIntegrationExample;
