// @flow

import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Notifications } from '../../Notifications';

describe('NotificationDrawerContents', () => {
  let container: HTMLDivElement;

  beforeAll(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterAll(() => {
    document.body.removeChild(container);
  });

  const testIframeUrl = (notifications: ReactWrapper, src: string) => {
    expect(notifications.find('iframe').props()).toMatchObject({ src });
  };

  it('should add the correct url to the iframe by default', () => {
    const notifications = mount(<Notifications />);
    testIframeUrl(notifications, '/home/notificationsDrawer/iframe.html');
  });

  it('should add the correct url to the iframe when a locale is provided', () => {
    const notifications = mount(<Notifications locale="en" />);
    testIframeUrl(
      notifications,
      '/home/notificationsDrawer/iframe.html?locale=en',
    );
  });

  it('should add the correct url to the iframe when a product is provided', () => {
    const notifications = mount(<Notifications product="jira" />);
    testIframeUrl(
      notifications,
      '/home/notificationsDrawer/iframe.html?product=jira',
    );
  });

  it('should add the correct url to the iframe when a locale and product is provided', () => {
    const notifications = mount(<Notifications locale="en" product="jira" />);
    testIframeUrl(
      notifications,
      '/home/notificationsDrawer/iframe.html?locale=en&product=jira',
    );
  });

  it('should render a spinner when iframe is loading', () => {
    const notifications = mount(<Notifications />);
    expect(notifications.find('Spinner').exists()).toBe(true);
  });

  it('should not render a spinner when the iframe has finished loading', () => {
    const notifications = mount(<Notifications />);
    notifications.find('iframe').simulate('load');

    expect(notifications.find('Spinner').exists()).toBe(false);
  });

  // TODO add this test in once jsdom adds better support for message events
  it.skip('should not render a spinner when a readyForUser message is sent from the iframe to the parent', async () => {
    const notifications = mount(<Notifications />, { attachTo: container });
    const iframe = notifications
      .find('iframe')
      .getDOMNode() as HTMLIFrameElement;

    const parentWindow = iframe.contentWindow!.parent;

    parentWindow.postMessage('readyForUser', '*');

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(notifications.find('Spinner').exists()).toBe(false);
  });
});
