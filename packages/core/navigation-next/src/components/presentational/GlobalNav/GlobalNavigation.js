// @flow

/**
 * NOTE: 'GlobalNav' is the layout primitive, which will be wrapped by the more
 * opinionated 'GlobalNavigation' component.
 */

import React, { Component, Fragment } from 'react';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import throttle from 'lodash.throttle';

import {
  FirstPrimaryItemWrapper,
  PrimaryItemsList,
  SecondaryItemsList,
} from './primitives';
import type { GlobalNavigationProps } from './types';

const THROTTLE_INTERVAL = 100;

export default class GlobalNavigation extends Component<GlobalNavigationProps> {
  vh = window.innerHeight * 0.01;

  throttledListener = throttle(this.listener, THROTTLE_INTERVAL);

  listener() {
    this.vh = window.innerHeight * 0.01;
    // $FlowFixMe - document.documentElement will be HTMLElement, not null
    document.documentElement.style.setProperty('--vh', `${this.vh}px`);
  }

  componentDidMount() {
    this.listener();
    window.addEventListener('resize', this.throttledListener);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledListener);
  }

  render() {
    const {
      itemComponent: ItemComponent,
      primaryItems,
      secondaryItems,
      theme,
    } = this.props;
    let wrapperStyles = theme.mode.globalNav({ topOffset: theme.topOffset });
    // Fix for mobile
    wrapperStyles = {
      ...wrapperStyles,
      height: `calc((var(--vh, 1vh) * 100) - ${theme.topOffset}px)`,
    };

    return (
      <NavigationAnalyticsContext
        data={{
          attributes: { navigationLayer: 'global' },
          componentName: 'globalNav',
        }}
      >
        <div css={wrapperStyles}>
          <PrimaryItemsList>
            <NavigationAnalyticsContext
              data={{ attributes: { navigationIconGrouping: 'primary' } }}
            >
              <Fragment>
                {primaryItems.map((props, index) => {
                  // Render the first item with a margin beneath it and a large icon
                  if (!index) {
                    const { icon: Icon, ...rest } = props;
                    return (
                      <FirstPrimaryItemWrapper key={props.id}>
                        <ItemComponent
                          {...rest}
                          icon={provided => <Icon {...provided} size="large" />}
                          size="large"
                          index={index}
                        />
                      </FirstPrimaryItemWrapper>
                    );
                  }
                  return (
                    <ItemComponent
                      {...props}
                      key={props.id}
                      size="small"
                      index={index}
                    />
                  );
                })}
              </Fragment>
            </NavigationAnalyticsContext>
          </PrimaryItemsList>

          <SecondaryItemsList>
            <NavigationAnalyticsContext
              data={{ attributes: { navigationIconGrouping: 'secondary' } }}
            >
              <Fragment>
                {secondaryItems.map((props, index) => (
                  <ItemComponent
                    {...props}
                    key={props.id}
                    size="small"
                    index={index}
                  />
                ))}
              </Fragment>
            </NavigationAnalyticsContext>
          </SecondaryItemsList>
        </div>
      </NavigationAnalyticsContext>
    );
  }
}
