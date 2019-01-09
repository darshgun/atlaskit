// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import exenv from 'exenv';
import Tag from '@atlaskit/tag';
import TagGroup from '../..';

jest.mock('exenv', () => ({
  get canUseDOM() {
    return false;
  },
}));

const App = () => (
  <TagGroup>
    <Tag text="Base Tag" />
  </TagGroup>
);

test('should ssr then hydrate tag-group correctly', () => {
  const canUseDom = jest.spyOn(exenv, 'canUseDOM', 'get');
  // server-side
  canUseDom.mockReturnValue(false);
  const serverHTML = ReactDOMServer.renderToString(<App />);
  // client-side
  canUseDom.mockReturnValue(true);
  const elem = document.createElement('div');
  elem.innerHTML = serverHTML;
  expect(() => ReactDOM.hydrate(<App />, elem)).not.toThrow();
});
