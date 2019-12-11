import {
  B50,
  B200,
  B400,
  DN10A,
  N0,
  N20,
  N40,
  N200,
  N600,
} from '@atlaskit/theme/colors';

import { Mode } from './types';
import { hexToRGBA } from './themeHelpers';

const defaultTheme: { mode: Mode } = {
  mode: {
    create: {
      active: {
        color: N0,
        backgroundColor: hexToRGBA(B400, 0.8),
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
        backgroundColor: hexToRGBA(B400, 0.9),
        boxShadow: '0 0 0 2px transparent',
      },
      selected: { color: '', backgroundColor: '', boxShadow: '' },
    },
    iconButton: {
      active: {
        color: B400,
        backgroundColor: hexToRGBA(B50, 0.6),
        boxShadow: '',
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
        color: B400,
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
      iconGradientStart: B400,
      iconGradientStop: B200,
      iconColor: B200,
    },
    primaryButton: {
      active: {
        color: B400,
        backgroundColor: hexToRGBA(B50, 0.7),
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
        color: B400,
        backgroundColor: hexToRGBA(B50, 0.9),
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
      default: {
        backgroundColor: N0,
        color: N200,
        borderColor: N40,
      },
      focus: {
        borderColor: B200,
      },
    },
    skeleton: { backgroundColor: N20, opacity: 1 },
  },
};

export const DEFAULT_THEME_NAME = 'atlassian';
export default defaultTheme;
