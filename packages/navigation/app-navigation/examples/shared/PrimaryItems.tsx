import React, { Fragment } from 'react';
import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { ThemedPrimaryButton } from '../../src/components/PrimaryButton';
import { ThemedPrimaryButtonProps } from '../../src/components/PrimaryButton/types';
import { useOverflowStatus } from '../../src/controllers/overflow';

const PrimaryButton = (props: ThemedPrimaryButtonProps) => {
  const { isVisible } = useOverflowStatus();
  if (isVisible) {
    return <ThemedPrimaryButton {...props} />;
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
  <PrimaryButton
    id="work"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
    text="Your work"
  />,
  <PrimaryButton
    id="workspaces"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Workspaces click', ...args);
    }}
    text="Workspaces"
  />,
  <PrimaryButton
    id="repositories"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Repositories click', ...args);
    }}
    text="Repositories"
  />,
  <PrimaryButton
    id="projects"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Projects click', ...args);
    }}
    text="Projects"
  />,
  <PrimaryButton
    id="pullrequests"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Pull requests click', ...args);
    }}
    text="Pull requests"
  />,
  <PrimaryButton
    id="issues"
    href="#"
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
  <PrimaryButton
    id="activity"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Activity click', ...args);
    }}
    text="Activity"
  />,
  <PrimaryButton
    id="work"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
    text="Your work"
  />,
  <PrimaryButton
    dropdownContent={SpacesContent}
    id="spaces"
    onClick={(...args: any[]) => {
      console.log('Spaces click', ...args);
    }}
    text="Spaces"
  />,
  <PrimaryButton
    id="people"
    onClick={(...args: any[]) => {
      console.log('People click', ...args);
    }}
    text="People"
  />,
  <PrimaryButton
    dropdownContent={ConfluenceAppsContent}
    id="apps"
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
  <PrimaryButton
    id="home"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Home click...', ...args);
    }}
    text="Home"
  />,
  <PrimaryButton
    dropdownContent={ProjectsContent}
    id="projects"
    onClick={(...args: any[]) => {
      console.log('Projects click', ...args);
    }}
    text="Projects"
  />,
  <PrimaryButton
    dropdownContent={IssuesContent}
    id="issues"
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
    text="Issues & Filters"
  />,
  <PrimaryButton
    dropdownContent={DashboardsContent}
    id="dashboards"
    onClick={(...args: any[]) => {
      console.log('Dashboards click', ...args);
    }}
    text="Dashboards"
  />,
];

export const opsGeniePrimaryItems = [
  <PrimaryButton
    id="alerts"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Alerts click', ...args);
    }}
    text="Alerts"
  />,
  <PrimaryButton
    id="incidents"
    href="#"
    onClick={(...args: any[]) => {
      console.log('Incidents click', ...args);
    }}
    text="Incidents"
  />,
  <PrimaryButton
    id="oncall"
    onClick={(...args: any[]) => {
      console.log('Who is on-call click', ...args);
    }}
    text="Who is on-call"
  />,
  <PrimaryButton
    id="teams"
    onClick={(...args: any[]) => {
      console.log('Teams click', ...args);
    }}
    text="Teams"
  />,
  <PrimaryButton
    id="services"
    onClick={(...args: any[]) => {
      console.log('Services click', ...args);
    }}
    text="Services"
  />,
  <PrimaryButton
    id="analytics"
    onClick={(...args: any[]) => {
      console.log('Analytics click', ...args);
    }}
    text="Analytics"
  />,
];

export const defaultPrimaryItems = jiraPrimaryItems;
