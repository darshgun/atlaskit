import React, { Component } from 'react';

import { DEFAULT_HISTORY } from '../../common/constants';
import { RouterContainer, getRouterState } from '../router-store';

import { RouterProps } from './types';

/**
 * Default prop provider for the RouterContainer.
 *
 */
export class Router extends Component<RouterProps> {
  static defaultProps = {
    isStatic: false,
    routes: [],
    history: DEFAULT_HISTORY,
    transitionBlocker: async () => true,
  };

  /**
   * Ensures that the router store stops listening to history when the Router
   * is unmounted.
   */
  componentWillUnmount() {
    if (!this.props.isStatic) {
      const state = getRouterState();

      state.unlisten && state.unlisten();
    }
  }

  render() {
    const {
      children,
      routes,
      history,
      isStatic,
      transitionBlocker,
      resourceContext,
      resourceData,
    } = this.props;

    return (
      <RouterContainer
        routes={routes}
        history={history}
        isStatic={isStatic}
        transitionBlocker={transitionBlocker}
        resourceContext={resourceContext}
        resourceData={resourceData}
        isGlobal
      >
        {children}
      </RouterContainer>
    );
  }
}
