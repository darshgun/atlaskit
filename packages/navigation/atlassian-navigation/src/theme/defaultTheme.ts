import {
  B50,
  B200,
  B400,
  DN10A,
  N0,
  N40,
  N80,
  N200,
  N500,
  N600,
} from '@atlaskit/theme/colors';

const defaultTheme = {
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
        boxShadow: '',
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
        backgroundColor: B50,
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
        backgroundColor: B400,
        boxShadow: `0 0 0 2px ${N80}`,
      },
      hover: {
        color: N500,
        backgroundColor: B50,
        boxShadow: '',
        opacity: 0.7,
      },
      selected: { color: '', backgroundColor: '', boxShadow: '' },
    },
    navigation: { backgroundColor: N0, color: N200 },
    primaryButton: {
      active: {
        color: N600,
        backgroundColor: B50,
        opacity: 0.5,
        boxShadow: '0 0 0 2px transparent',
      },
      default: {
        color: N600,
        backgroundColor: '',
        boxShadow: '0 0 0 2px transparent',
      },
      focus: {
        color: N600,
        backgroundColor: '',
        boxShadow: `0 0 0 2px ${B200}`,
      },
      hover: {
        color: N600,
        backgroundColor: B50,
        opacity: 0.5,
        boxShadow: '0 0 0 2px transparent',
      },
      selected: {
        color: B400,
        backgroundColor: '',
        boxShadow: '',
        bordorBottom: B400,
      },
    },
    search: {
      backgroundColor: N0,
      color: N200,
      border: `2px solid ${N40}`,
    },
    skeleton: { backgroundColor: DN10A, opacity: '0.15' },
  },
};

export const DEFAULT_THEME_NAME = 'atlassian';
export default defaultTheme;
