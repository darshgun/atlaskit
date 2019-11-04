import React from 'react';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import { PrimaryButton, PrimaryButtonProps } from '../../src';
import { useOverflowStatus } from '../../src/controllers/overflow';

const NavigationButton = (props: PrimaryButtonProps) => {
  const { isVisible } = useOverflowStatus();
  if (isVisible) {
    return <PrimaryButton {...props} />;
  } else {
    return <DropdownItem>{props.children}</DropdownItem>;
  }
};

export const bitbucketPrimaryItems = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
  >
    Your work
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Workspaces click', ...args);
    }}
  >
    Workspaces
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Repositories click', ...args);
    }}
  >
    Repositories
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Projects click', ...args);
    }}
  >
    Projects
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Pull requests click', ...args);
    }}
  >
    Pull requests
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
  >
    Issues
  </NavigationButton>,
];

export const confluencePrimaryItems = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Activity click', ...args);
    }}
  >
    Activity
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Your work click', ...args);
    }}
  >
    Your work
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Spaces click', ...args);
    }}
  >
    Spaces
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('People click', ...args);
    }}
  >
    People
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Apps click', ...args);
    }}
  >
    Apps
  </NavigationButton>,
];

export const jiraPrimaryItems = [
  <PrimaryButton href="#">Home</PrimaryButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Projects click', ...args);
    }}
  >
    Projects
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Issues click', ...args);
    }}
    isHighlighted
  >
    Filters
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Dashboards click', ...args);
    }}
  >
    Dashboards
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Apps click', ...args);
    }}
  >
    Apps
  </NavigationButton>,
];

export const opsGeniePrimaryItems = [
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Alerts click', ...args);
    }}
  >
    Alerts
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Incidents click', ...args);
    }}
  >
    Incidents
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Who is on-call click', ...args);
    }}
  >
    Who is on-call
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Teams click', ...args);
    }}
  >
    Teams
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Services click', ...args);
    }}
  >
    Services
  </NavigationButton>,
  <NavigationButton
    onClick={(...args: any[]) => {
      console.log('Analytics click', ...args);
    }}
  >
    Analytics
  </NavigationButton>,
];

export const defaultPrimaryItems = jiraPrimaryItems;
