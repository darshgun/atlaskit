import {
  B400,
  G300,
  N0,
  N800,
  P300,
  R300,
  T300,
  Y300,
} from '@atlaskit/theme/colors';
import { generateTheme } from '../../src';

export const themes = [
  generateTheme({
    name: 'atlassian',
    primary: {
      backgroundColor: B400,
      color: N0,
    },
  }),
  generateTheme({
    name: 'settings',
    primary: {
      backgroundColor: N800,
      color: N0,
    },
  }),
  generateTheme({
    name: 'white',
    primary: {
      backgroundColor: N0,
      color: N800,
    },
  }),
  generateTheme({
    name: 'red',
    primary: {
      backgroundColor: R300,
      color: N0,
    },
  }),
  generateTheme({
    name: 'orange',
    primary: {
      backgroundColor: Y300,
      color: N800,
    },
  }),
  generateTheme({
    name: 'yellow',
    primary: {
      backgroundColor: '#ffff00',
      color: N800,
    },
  }),
  generateTheme({
    name: 'green',
    primary: {
      backgroundColor: G300,
      color: N800,
    },
  }),
  generateTheme({
    name: 'blue',
    primary: {
      backgroundColor: T300,
      color: N800,
    },
  }),
  generateTheme({
    name: 'violet',
    primary: {
      backgroundColor: P300,
      color: N0,
    },
  }),
  generateTheme({
    name: 'pink',
    primary: {
      backgroundColor: '#fec8d8',
      color: N800,
    },
  }),
];
