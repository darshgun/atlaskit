import * as React from 'react';
import { Component } from 'react';

import Badge from '@atlaskit/badge';
import { NotificationLogProvider } from '@atlaskit/notification-log-client';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const MAX_NOTIFICATIONS_COUNT: number = 9;
const NAVIGATION_CHANNEL = 'navigation';

export interface ValueUpdatingParams {
  source: string;
  visibilityChangesSinceTimer?: number;
}

export interface ValueUpdatingResult {
  skip?: boolean;
  countOverride?: number;
}

export interface ValueUpdatedParams {
  oldCount: number;
  newCount: number;
  source: string;
}

export interface Props {
  notificationLogProvider: Promise<NotificationLogProvider>;
  appearance?: string;
  max?: number;
  refreshRate?: number;
  refreshOnHidden?: boolean;
  refreshOnVisibilityChange?: boolean;
  onCountUpdating?: (param: ValueUpdatingParams) => ValueUpdatingResult;
  onCountUpdated?: (param: ValueUpdatedParams) => void;
  createAnalyticsEvent?: any;
}

export interface State {
  count: number | null;
}

class NotificationIndicator extends Component<Props, State> {
  private intervalId?: number;
  private visibilityChangesSinceTimer: number = 0;
  private notificationLogProvider?: NotificationLogProvider;

  static defaultProps: Partial<Props> = {
    appearance: 'important',
    max: MAX_NOTIFICATIONS_COUNT,
    refreshRate: 0,
    refreshOnHidden: false,
    refreshOnVisibilityChange: true,
  };

  state: State = {
    count: null,
  };

  async componentDidMount() {
    this.notificationLogProvider = await this.props.notificationLogProvider;
    this.refresh('mount');
    this.updateInterval();
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.refreshRate !== this.props.refreshRate) {
      this.updateInterval();
    }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private updateInterval() {
    const { refreshRate } = this.props;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (refreshRate && refreshRate > 0) {
      this.intervalId = window.setInterval(this.timerTick, refreshRate);
    }
  }

  private onVisibilityChange = () => {
    if (this.props.refreshOnVisibilityChange && this.shouldRefresh()) {
      this.visibilityChangesSinceTimer++;
      this.refresh('visibility');
    }
  };

  private shouldRefresh = () => {
    return !document.hidden || this.props.refreshOnHidden;
  };

  private timerTick = () => {
    this.visibilityChangesSinceTimer = 0;
    this.refresh('timer');
  };

  private refresh = async source => {
    // Provider should be available by this point, if not, we exit.
    if (!this.notificationLogProvider) {
      return;
    }

    // If user is not viewing the webpage, then skip this refresh to avoid unnecessary request.
    if (!this.shouldRefresh()) {
      return;
    }

    const visibilityChangesSinceTimer = this.visibilityChangesSinceTimer;
    const updatingEvent: ValueUpdatingParams = {
      source,
      visibilityChangesSinceTimer,
    };
    const updatingResult =
      (this.props.onCountUpdating &&
        this.props.onCountUpdating(updatingEvent)) ||
      {};
    if (updatingResult.skip) {
      return;
    }

    try {
      const count =
        updatingResult.countOverride ||
        (await this.notificationLogProvider.countUnseenNotifications({
          queryParams: {
            currentCount: this.state.count,
          },
        })).count;

      if (
        this.props.onCountUpdated &&
        (this.state.count === null || this.state.count !== count)
      ) {
        // TODO mt: decide the event payload and channel
        const { createAnalyticsEvent } = this.props;
        if (createAnalyticsEvent && source === 'mount' && count > 0) {
          const event = createAnalyticsEvent({
            name: 'notificationsDrawer',
            action: 'mounted',
            attributes: {
              badgeCount: count,
            },
          });
          event.fire(NAVIGATION_CHANNEL);
        }

        this.props.onCountUpdated({
          oldCount: this.state.count || 0,
          newCount: count,
          source,
        });
      }
      this.setState({ count });
    } catch (e) {
      // Do nothing
    }
  };

  render() {
    const { count } = this.state;

    const { appearance, max } = this.props;

    return count ? (
      <div data-test-selector="NotificationIndicator">
        <Badge max={max} appearance={appearance} value={count} />
      </div>
    ) : null;
  }
}

export default withAnalyticsEvents()(NotificationIndicator);
