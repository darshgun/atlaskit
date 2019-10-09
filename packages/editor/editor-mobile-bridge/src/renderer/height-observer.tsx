import * as React from 'react';
import debounce from 'lodash.debounce';
import { eventDispatcher } from './dispatcher';
import { toNativeBridge } from './web-to-native/implementation';
import { RefObject } from 'react';

export type Props = {};
export type State = {
  enabled: Boolean;
};

export default class HeightObserver extends React.Component<Props, State> {
  private mutationObserver: MutationObserver = new MutationObserver(
    debounce(this.mutationCallback, 1000).bind(this),
  );
  private container: RefObject<HTMLDivElement> = React.createRef();
  private containerScrollHeight: number = -1;

  constructor(props: Props) {
    super(props);
    this.state = {
      enabled: false,
    };
  }

  componentDidMount() {
    eventDispatcher.on('observeRenderedContentHeight', ({ enabled }) => {
      this.setState({ enabled });
    });
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (this.state.enabled !== prevState.enabled) {
      if (this.state.enabled) {
        if (this.container.current) {
          this.mutationObserver.observe(this.container.current, {
            childList: true,
            subtree: true,
          });
        }
      } else {
        this.mutationObserver.disconnect();
      }
    }
  }

  private mutationCallback() {
    if (this.container.current) {
      const newContainerScrollHeight = this.container.current.scrollHeight;
      if (this.containerScrollHeight !== newContainerScrollHeight) {
        toNativeBridge.call('renderBridge', 'onRenderedContentHeightChanged', {
          height: newContainerScrollHeight,
        });
        this.containerScrollHeight = newContainerScrollHeight;
      }
    }
  }

  render() {
    return <div ref={this.container}>{this.props.children}</div>;
  }
}
