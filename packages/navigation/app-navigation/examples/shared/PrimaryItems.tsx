import React, { Fragment } from 'react';
import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { PrimaryButton, PrimaryButtonProps } from '../../src';
import { useOverflowStatus } from '../../src/controllers/overflow';

const NavigationButton = (props: PrimaryButtonProps) => {
  const { isVisible } = useOverflowStatus();
  if (isVisible) {
    return <PrimaryButton {...props} />;
  } else {
    if (props.dropdownContent) {
      return (
        <DropdownItemGroup title={props.text}>
          <props.dropdownContent />
        </DropdownItemGroup>
      );
    } else {
      return <DropdownItem onClick={props.onClick}>{props.text}</DropdownItem>;
    }
  }
};

const DropdownContent = ({ sections }: { sections: typeof projectsData }) => {
  const { isVisible } = useOverflowStatus();
  if (isVisible) {
    return (
      <Fragment>
        {sections.map(section => (
          <DropdownItemGroup key={section.title} title={section.title}>
            {section.items.map(item => (
              <DropdownItem key={item}>{item}</DropdownItem>
            ))}
          </DropdownItemGroup>
        ))}
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        {sections.map(section => (
          <DropdownItemGroup key={section.title}>
            {section.items.map(item => (
              <DropdownItem key={item}>{item}</DropdownItem>
            ))}
          </DropdownItemGroup>
        ))}
      </Fragment>
    );
  }
};

export const bitbucketPrimaryItems = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
    text="Your work"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Workspaces click', ...args);
    }}
    text="Workspaces"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Repositories click', ...args);
    }}
    text="Repositories"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Projects click', ...args);
    }}
    text="Projects"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Pull requests click', ...args);
    }}
    text="Pull requests"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
    text="Issues"
  />,
];

const ConfluenceAppsContent = () => (
  <Fragment>
    <DropdownItem>Calendars</DropdownItem>
    <DropdownItem>Analytics</DropdownItem>
    <DropdownItem>Questions</DropdownItem>
    <DropdownItem>Tree Search</DropdownItem>
  </Fragment>
);

const SpacesContent = () => (
  <Fragment>
    <DropdownItemGroup title="Starred spaces">
      <DropdownItem>My space</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup>
      <DropdownItem>View all spaces</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

export const confluencePrimaryItems = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Activity click', ...args);
    }}
    text="Activity"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
    text="Your work"
  />,
  <NavigationButton
    dropdownContent={SpacesContent}
    onClick={(...args: any[]) => {
      console.log('Spaces click', ...args);
    }}
    text="Spaces"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('People click', ...args);
    }}
    text="People"
  />,
  <NavigationButton
    dropdownContent={ConfluenceAppsContent}
    onClick={(...args: any[]) => {
      console.log('Apps click', ...args);
    }}
    text="Apps"
  />,
];

const projectsData = [
  {
    title: 'Favourite Projects',
    items: ['Mobile Research', 'IT Services'],
  },
  {
    title: 'Recent Projects',
    items: [
      'Engineering Leadership',
      'BAU',
      'Hardware Support',
      'New Features',
      'SAS',
    ],
  },
];

const ProjectsContent = () => <DropdownContent sections={projectsData} />;

const issuesData = [
  {
    title: 'Recent Issues',
    items: ['Issue One', 'Issue Two'],
  },
  {
    title: '',
    items: ['View all recent issues'],
  },
  {
    title: 'Recent Filters',
    items: ['Filter One', 'Filter Two', 'Filter Three'],
  },
];

const IssuesContent = () => <DropdownContent sections={issuesData} />;

const dashboardsData = [
  {
    title: '',
    items: ['System Dashboard', 'View all dashboards'],
  },
];

const DashboardsContent = () => <DropdownContent sections={dashboardsData} />;

export const jiraPrimaryItems = [
  <NavigationButton
    href="#"
    onClick={(...args: any[]) => {
      console.log('Home click...', ...args);
    }}
    text="Home"
  />,
  <NavigationButton
    dropdownContent={ProjectsContent}
    onClick={(...args: any[]) => {
      console.log('Projects click', ...args);
    }}
    text="Projects"
  />,
  <NavigationButton
    dropdownContent={IssuesContent}
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
    text="Issues & Filters"
  />,
  <NavigationButton
    dropdownContent={DashboardsContent}
    onClick={(...args: any[]) => {
      console.log('Dashboards click', ...args);
    }}
    text="Dashboards"
  />,
];

export const opsGeniePrimaryItems = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Alerts click', ...args);
    }}
    text="Alerts"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Incidents click', ...args);
    }}
    text="Incidents"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Who is on-call click', ...args);
    }}
    text="Who is on-call"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Teams click', ...args);
    }}
    text="Teams"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Services click', ...args);
    }}
    text="Services"
  />,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Analytics click', ...args);
    }}
    text="Analytics"
  />,
];

export const defaultPrimaryItems = jiraPrimaryItems;
