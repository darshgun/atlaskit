// @flow

import React, { PureComponent, type Ref, type Node } from 'react';
import { PageWrapper } from './primitives';
import type { CollapseListeners } from '../LayoutManager/types';
import ResizeTransition, { isTransitioning } from '../ResizeTransition';

import {
  CONTENT_NAV_WIDTH_COLLAPSED,
  CONTENT_NAV_WIDTH_FLYOUT,
} from '../../../common/constants';

type PageProps = {
  ...$Exact<CollapseListeners>,
  children: Node,
  flyoutIsOpen: boolean,
  innerRef: Ref<'div'>,
  isResizing: boolean,
  isCollapsed: boolean,
  productNavWidth: number,
  topOffset: number,
  leftOffset: number,
};

export default class PageContent extends PureComponent<PageProps> {
  static defaultProps = {
    leftOffset: 0,
    topOffset: 0,
  };

  render() {
    const {
      children,
      flyoutIsOpen,
      innerRef,
      isResizing,
      isCollapsed,
      leftOffset,
      productNavWidth,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      topOffset,
    } = this.props;
    return (
      <ResizeTransition
        from={[CONTENT_NAV_WIDTH_COLLAPSED]}
        in={!isCollapsed}
        productNavWidth={productNavWidth}
        properties={['paddingLeft']}
        to={[flyoutIsOpen ? CONTENT_NAV_WIDTH_FLYOUT : productNavWidth]}
        userIsDragging={isResizing}
        /* Attach expand/collapse callbacks to the page resize transition to ensure they are only
         * called when the nav is permanently expanded/collapsed, i.e. when page content position changes. */
        onExpandStart={onExpandStart}
        onExpandEnd={onExpandEnd}
        onCollapseStart={onCollapseStart}
        onCollapseEnd={onCollapseEnd}
      >
        {({ transitionStyle, transitionState }) => (
          <PageWrapper
            disableInteraction={isResizing || isTransitioning(transitionState)}
            innerRef={innerRef}
            leftOffset={leftOffset}
            topOffset={topOffset}
            style={transitionStyle}
          >
            {children}
          </PageWrapper>
        )}
      </ResizeTransition>
    );
  }
}
