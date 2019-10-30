import {
  B50,
  B200,
  B400,
  DN10A,
  N0,
  N40,
  N200,
  N500,
  N600,
} from '@atlaskit/theme/colors';
import chromatism from 'chromatism';

import { Mode } from './types';

const hexToRGBA = (hex: string, opacity: number = 1) => {
  const rgba = { ...chromatism.convert(hex).rgb, ...{ a: opacity } };

  return `rgba(${Object.values(rgba).join(', ')})`;
};

const defaultTheme: { mode: Mode } = {
  mode: {
    create: {
      active: {
        color: N0,
        backgroundColor: 'rgb(33,104,211)',
        boxShadow: '0 0 0 2px transparent',
      },
      default: {
        color: N0,
        backgroundColor: B400,
        boxShadow: '0 0 0 2px transparent',
      },
      focus: {
        color: N0,
        backgroundColor: B400,
        boxShadow: '0 0 0 2px rgb(128,169,230)',
      },
      hover: {
        color: N0,
        backgroundColor: 'rgb(20,96,208)',
        boxShadow: '0 0 0 2px transparent',
      },
      selected: { color: '', backgroundColor: '', boxShadow: '' },
    },
    iconButton: {
      active: {
        color: N500,
        backgroundColor: hexToRGBA(B50, 0.3),
        boxShadow: '',
        opacity: 0.5,
      },
      default: {
        color: N600,
        backgroundColor: 'transparent',
        boxShadow: '',
      },
      focus: {
        color: N600,
        backgroundColor: hexToRGBA(B50, 0.5),
        boxShadow: `0 0 0 2px ${B200}`,
      },
      hover: {
        color: N500,
        backgroundColor: hexToRGBA(B50, 0.9),
        boxShadow: '',
      },
      selected: { color: '', backgroundColor: '', boxShadow: '' },
    },
    navigation: { backgroundColor: N0, color: N200 },
    productHome: {
      backgroundColor: B400,
      color: DN10A,
      borderRight: `1px solid ${hexToRGBA(N200, 0.3)}`,
    },
    primaryButton: {
      active: {
        color: N600,
        backgroundColor: hexToRGBA(B50, 0.5),
        boxShadow: '0 0 0 2px transparent',
      },
      default: {
        color: N600,
        backgroundColor: 'transparent',
        boxShadow: '0 0 0 2px transparent',
      },
      focus: {
        color: N600,
        backgroundColor: '',
        boxShadow: `0 0 0 2px ${B200}`,
      },
      hover: {
        color: N600,
        backgroundColor: hexToRGBA(B50, 0.5),
        boxShadow: '0 0 0 2px transparent',
      },
      selected: {
        color: B400,
        backgroundColor: '',
        boxShadow: '',
        bordorBottom: `4px solid ${B400}`,
      },
    },
    search: {
      backgroundColor: N0,
      color: N200,
      border: `2px solid ${N40}`,
    },
    skeleton: { backgroundColor: DN10A, opacity: 0.15 },
  },
};

export const DEFAULT_THEME_NAME = 'atlassian';
export default defaultTheme;
