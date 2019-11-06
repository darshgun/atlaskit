/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Component, useState } from 'react';
import Popup from '@atlaskit/popup';
import Spinner from '@atlaskit/spinner';
import AtlassianSwitcher from '@atlaskit/atlassian-switcher';

import { AppSwitcher } from '../../src';
import {
  mockEndpoints,
  REQUEST_FAST,
} from '@atlaskit/atlassian-switcher-test-utils';
import {
  withAnalyticsLogger,
  withIntlProvider,
} from '../../../atlassian-switcher/examples/helpers';

const spinnerCSS = {
  display: 'flex',
  justifyContent: 'center',
  maxWidth: 240,
  position: 'relative',
  top: '11.25rem',
} as const;

class SwitcherData extends Component<{ scheduleUpdate: () => void }> {
  state = {
    isLoaded: false,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    mockEndpoints(
      'jira',
      originalMockData => {
        return {
          ...originalMockData,
          RECENT_CONTAINERS_DATA: {
            data: [],
          },
          CUSTOM_LINKS_DATA: {
            data: [],
          },
          XFLOW_SETTINGS: {},
        };
      },
      REQUEST_FAST,
    );
    this.setState({
      isLoaded: true,
    });
    this.props.scheduleUpdate();
  };

  render() {
    return this.state.isLoaded ? (
      <div style={{ width: 400, maxHeight: 'calc(100vh - 100px)' }}>
        <h3 style={{ padding: '24px 24px 8px 24px' }}>Switch to</h3>
        <div style={{ padding: '0 16px' }}>
          <AtlassianSwitcher
            product="jira"
            disableCustomLinks
            disableRecentContainers
            disableHeadings
            isDiscoverMoreForEveryoneEnabled
            cloudId="some-cloud-id"
            appearance="standalone"
          />
        </div>
      </div>
    ) : (
      <div css={spinnerCSS}>
        <Spinner size="large" />
      </div>
    );
  }
}

const SwitcherContent = withIntlProvider(withAnalyticsLogger(SwitcherData));

export const SwitcherPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      placement="bottom-start"
      content={({ scheduleUpdate }) => (
        <SwitcherContent scheduleUpdate={scheduleUpdate} />
      )}
      isOpen={isOpen}
      onClose={onClose}
      trigger={triggerProps => (
        <AppSwitcher
          onClick={onClick}
          tooltip="Switch to..."
          {...triggerProps}
        />
      )}
    />
  );
};
