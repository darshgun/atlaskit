/* eslint-disable max-len */
import React, { Component } from 'react';
import { uid } from 'react-uid';

import { Props, DefaultProps } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
  <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" focusable="false" aria-hidden="true">
    <title>logo/trello</title>
    <defs>
        <linearGradient x1="49.9916681%" y1="43.5833348%" x2="49.9916681%" y2="138.166647%" id="${id}">
            <stop stop-color="${iconGradientStart}" offset="0%"></stop>
            <stop stop-color="${iconGradientStop}" offset="75%"></stop>
        </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
        <path d="M18.7473754,3 L5.24962506,3 C4.00719145,3 3,4.00736109 3,5.2500015 L3,18.7499985 C3,19.9926389 4.00719145,21 5.24962506,21 L18.7473754,21 C19.3445326,21.0007943 19.9175044,20.7640931 20.3400399,20.34205 C20.7625754,19.9200069 21,19.3472556 21,18.7499985 L21,5.2500015 C21,4.65274439 20.7625754,4.0799931 20.3400399,3.65795 C19.9175044,3.2359069 19.3445326,2.99920566 18.7473754,3 Z M11,15.9636099 C10.991039,16.538339 10.4640253,17 9.81703987,17 L6.17968323,17 C5.52816217,17 5,16.5307788 5,15.9519651 L5,15.9519651 L5,6.04803493 C5,5.77007879 5.1242877,5.503507 5.34552122,5.30696233 C5.56675474,5.11041765 5.86681179,5 6.17968323,5 L9.81703987,5 C10.4690931,5 10.9981938,5.46875063 11,6.04803493 L11,15.9636099 Z M19,11.9032749 C19,12.1941445 18.8756444,12.4731008 18.65429,12.6787767 C18.4329356,12.8844525 18.1327145,13 17.8196721,13 L14.1803279,13 C13.5284508,13 13,12.5089795 13,11.9032749 L13,6.09672506 C13,5.80585549 13.1243556,5.52689918 13.34571,5.32122333 C13.5670644,5.11554749 13.8672855,5 14.1803279,5 L17.8196721,5 C18.1327145,5 18.4329356,5.11554749 18.65429,5.32122333 C18.8756444,5.52689918 19,5.80585549 19,6.09672506 L19,6.09672506 L19,11.9032749 Z" id="Shape" fill="url(#${id})" fill-rule="nonzero"></path>
    </g>
</svg>`;
};

export default class TrelloIcon extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
