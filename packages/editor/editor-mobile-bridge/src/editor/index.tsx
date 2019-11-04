import '@babel/polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MobileEditor from './mobile-editor-element';
import { determineMode } from '../bridge-utils';

const params = new URLSearchParams(window.location.search);
const mode = determineMode(params.get('mode'));

ReactDOM.render(
  <MobileEditor mode={mode} />,
  document.getElementById('editor'),
);
