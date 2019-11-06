/** @jsx jsx */
import Drawer from '@atlaskit/drawer';
import Button from '@atlaskit/button';
import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import Popup from '@atlaskit/popup';
import { PopupProps } from '@atlaskit/popup/types';
import { jsx } from '@emotion/core';
import { Fragment, KeyboardEvent, useState } from 'react';

import { ThemeProvider } from 'styled-components';
import { ProfilePopup } from './shared/ProfilePopup';
import { SwitcherPopup } from './shared/SwitcherPopup';
import { HelpPopup } from './shared/HelpPopup';
import { NotificationsPopup } from './shared/NotificationsPopup';

import { DefaultCreate } from './shared/Create';
import {
  AtlassianNavigation,
  PrimaryDropdownButton,
  PrimaryButton,
  ProductHome,
  Search,
  Settings,
  atlassianTheme,
  _itemTheme,
} from '../src';
import { useOverflowStatus } from '../src/controllers/overflow';

const Icon = () => {
  const {
    mode: { productHome },
  } = atlassianTheme;
  return (
    <Button
      appearance="subtle-link"
      href="#"
      iconBefore={
        <JiraIcon
          iconGradientStart={productHome.gradientStart}
          iconGradientStop={productHome.gradientStop}
          iconColor={productHome.iconColor}
          textColor={productHome.color}
        />
      }
    />
  );
};

const Logo = () => {
  const {
    mode: { productHome },
  } = atlassianTheme;
  return (
    <Button
      appearance="subtle-link"
      href="#"
      iconBefore={
        <JiraLogo
          iconGradientStart={productHome.gradientStart}
          iconGradientStop={productHome.gradientStop}
          iconColor={productHome.iconColor}
          textColor={productHome.color}
        />
      }
    />
  );
};

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
    <ThemeProvider theme={_itemTheme}>
      <Fragment>
        <Settings onClick={onClick} tooltip="Settings" />
        <Drawer isOpen={isOpen} onClose={onClose}>
          settings drawer
        </Drawer>
      </Fragment>
    </ThemeProvider>
  );
};

const ProjectsContent = () => (
  <ThemeProvider theme={_itemTheme}>
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
  </ThemeProvider>
);

const FiltersContent = () => (
  <ThemeProvider theme={_itemTheme}>
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
  </ThemeProvider>
);

const DashboardsContent = () => (
  <ThemeProvider theme={_itemTheme}>
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
  </ThemeProvider>
);

const AppsContent = () => (
  <ThemeProvider theme={_itemTheme}>
    <Fragment>
      <DropdownItem>Portfolio</DropdownItem>
      <DropdownItem>Tempo timesheets</DropdownItem>
      <DropdownItem>Slack</DropdownItem>
      <DropdownItem>Invision</DropdownItem>
      <DropdownItemGroup>
        <DropdownItem>Explore apps</DropdownItem>
      </DropdownItemGroup>
    </Fragment>
  </ThemeProvider>
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
          isSelected={isOpen}
          {...triggerProps}
        >
          {text}
        </PrimaryDropdownButton>
      )}
    />
  );
};

const primaryItems = [
  <PrimaryButton href="#">Home</PrimaryButton>,
  <PrimaryDropdown content={ProjectsContent} text="Projects" />,
  <PrimaryDropdown
    isHighlighted
    content={FiltersContent}
    text="Filters &amp; issues"
  />,
  <PrimaryDropdown content={DashboardsContent} text="Dashboards" />,
  <PrimaryDropdown content={AppsContent} text="Apps" />,
];

const JiraIntegrationExample = () => (
  <Fragment>
    <AtlassianNavigation
      primaryItems={primaryItems}
      renderAppSwitcher={SwitcherPopup}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
      renderNotifications={NotificationsPopup}
      renderProductHome={ProductHomeExample}
      renderProfile={ProfilePopup}
      renderSearch={SearchDrawer}
      renderSettings={SettingsDrawer}
      moreLabel="More"
    />
    <p>
      To display Notifications, ensure you're logged in to
      https://id.stg.internal.atlassian.com/login
    </p>
  </Fragment>
);

export default JiraIntegrationExample;
