import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import MobileRenderer from '../../../renderer/mobile-renderer-element';

const initialDocument = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is the mobile renderer',
        },
      ],
    },
  ],
});

const invalidDocument = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mention',
      content: [
        {
          type: 'paragraph',
          text: 'This is invalid adf',
        },
      ],
    },
  ],
});

describe('renderer bridge', () => {
  let onContentRendered: jest.Mock;
  let mobileRenderer: ReactWrapper<MobileRenderer>;

  const initRenderer = (adf: string): ReactWrapper<MobileRenderer> =>
    mount(<MobileRenderer document={adf} />);

  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
    onContentRendered = jest.fn();
    window.renderBridge = { onContentRendered };
  });

  afterEach(() => {
    mobileRenderer.unmount();
  });

  it('should call renderBridge.onContentRendered() once rendered', () => {
    mobileRenderer = initRenderer(initialDocument);
    expect(onContentRendered).toHaveBeenCalled();
  });

  it('should still call renderBridge.onContentRendered() when given invalid adf', () => {
    mobileRenderer = initRenderer(invalidDocument);
    expect(onContentRendered).toHaveBeenCalled();
  });
});
