import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import invariant from 'tiny-invariant';
import { canUseDOM } from 'exenv';
import { layers } from '@atlaskit/theme';

import { PORTAL_MOUNT_EVENT, PORTAL_UNMOUNT_EVENT } from '../constants';

type Props = {
  /* Children to render in the React Portal. */
  children: ReactNode;
  /* The z-index of the DOM container element. */
  zIndex: number | string;
};

type State = {
  container?: HTMLElement;
  portalIsMounted: boolean;
};

type LayerKey = keyof typeof layers;

export type PortalEvent = {
  element: LayerKey | null;
  zIndex: number;
};

const createContainer = (zIndex: number | string) => {
  const container = document.createElement('div');
  container.setAttribute('class', 'atlaskit-portal');
  container.setAttribute('style', `z-index: ${zIndex};`);
  return container;
};

const body = () => {
  invariant(document && document.body, 'cannot find document.body');
  return document.body;
};

const portalParent = () => {
  const parentElement = document.querySelector(
    'body > .atlaskit-portal-container',
  );
  if (!parentElement) {
    const parent = document.createElement('div');
    parent.setAttribute('class', 'atlaskit-portal-container');
    parent.setAttribute('style', `display: flex;`);
    body().appendChild(parent);
    return parent;
  }
  return parentElement;
};

const zIndexToName = Object.keys(layers).reduce(
  (acc: Record<number, string>, name: string) => {
    const value: number = layers[name]();
    acc[value] = name;
    return acc;
  },
  {},
);

const getLayerName = (zIndex: number): LayerKey | null => {
  return Object.prototype.hasOwnProperty.call(zIndexToName, zIndex)
    ? zIndexToName[zIndex]
    : null;
};

const fireMountUnmountEvent = (eventName: string, zIndex: number) => {
  const event = new CustomEvent<PortalEvent>(eventName, {
    detail: {
      element: getLayerName(Number(zIndex)),
      zIndex,
    },
  });
  window.dispatchEvent(event);
};

// This is a generic component does two things:
// 1. Portals it's children using React.createPortal
// 2. Creates the DOM node container for the portal based on props
// 3. Ensures DOM the container creates it's own stacking context

class Portal extends React.Component<Props, State> {
  static defaultProps = {
    zIndex: 0,
  };

  state = {
    container: canUseDOM ? createContainer(this.props.zIndex) : undefined,
    portalIsMounted: false,
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { container } = this.state;
    const { zIndex } = this.props;
    if (container && prevProps.zIndex !== zIndex) {
      const newContainer = createContainer(zIndex);

      portalParent().replaceChild(container, newContainer);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ container: newContainer });
    } else if (!prevState.container && container) {
      // SSR path
      portalParent().appendChild(container);
    }
  }

  componentDidMount() {
    const { container } = this.state;
    const { zIndex } = this.props;
    if (container) {
      portalParent().appendChild(container);
    } else {
      // SSR path
      const newContainer = createContainer(zIndex);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ container: newContainer });
    }
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      portalIsMounted: true,
    });

    fireMountUnmountEvent(PORTAL_MOUNT_EVENT, Number(zIndex));
  }

  componentWillUnmount() {
    const { container } = this.state;
    const { zIndex } = this.props;
    if (container) {
      portalParent().removeChild(container);
      // clean up parent element if there are no more portals
      const portals = !!document.querySelector(
        'body > .atlaskit-portal-container > .atlaskit-portal',
      );
      if (!portals) {
        body().removeChild(portalParent());
      }
    }

    fireMountUnmountEvent(PORTAL_UNMOUNT_EVENT, Number(zIndex));
  }

  render() {
    const { container, portalIsMounted } = this.state;
    return container && portalIsMounted
      ? ReactDOM.createPortal(this.props.children, container)
      : null;
  }
}

export default Portal;
