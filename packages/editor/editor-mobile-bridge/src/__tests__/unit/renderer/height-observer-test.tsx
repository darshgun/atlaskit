import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import RendererBridgeImpl from '../../../renderer/native-to-web/implementation';
import HeightObserver from '../../../renderer/height-observer';

describe('height observer', () => {
  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 0,
    });
    window.renderBridge = undefined;
  });

  function setNumberOfLines(
    heightObserver: ReactWrapper,
    numberOfLines: number,
  ) {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: numberOfLines * 100, // height of a single line is e.g. 100
    });

    const lines = [...Array(numberOfLines)].map((e, i) => <p key={i} />);
    heightObserver.setProps({ children: lines }); // set children to re-render
  }

  it('should start observing height when event is emitted and calls bridge with a debounce', done => {
    const heightObserver = mount(<HeightObserver />);
    const onRenderedContentHeightChanged = jest.fn();

    window.renderBridge = {
      onRenderedContentHeightChanged,
      onContentRendered() {},
    };

    const rendererBridge = new RendererBridgeImpl();
    rendererBridge.observeRenderedContentHeight(true);

    setNumberOfLines(heightObserver, 10);
    setNumberOfLines(heightObserver, 20);
    setNumberOfLines(heightObserver, 7);

    // need this to ensure bridge is called
    setTimeout(() => {
      // only one time because of the debounce.
      expect(onRenderedContentHeightChanged).toBeCalledTimes(1);
      expect(onRenderedContentHeightChanged).toBeCalledWith(700);
      heightObserver.unmount();
      done();
    });
  });

  it('does not call bridge if not enabled ', done => {
    const heightObserver = mount(<HeightObserver />);
    const onRenderedContentHeightChanged = jest.fn();

    window.renderBridge = {
      onRenderedContentHeightChanged,
      onContentRendered() {},
    };

    setNumberOfLines(heightObserver, 7);

    // need this to ensure bridge is called
    setTimeout(() => {
      expect(onRenderedContentHeightChanged).not.toHaveBeenCalled();
      heightObserver.unmount();
      done();
    });
  });
});
