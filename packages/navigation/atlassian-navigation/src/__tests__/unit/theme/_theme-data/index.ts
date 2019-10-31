import { GenerateThemeArgs, Mode } from '../../../../theme/types';

export const atlassianColorScheme: GenerateThemeArgs = {
  name: 'atlassian',
  highlightColor: '#0052CC',
  backgroundColor: '#FFFFFF',
};

export const atlassianTheme: { mode: Mode } = {
  mode: {
    create: {
      active: {
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 82, 204, 0.8)',
        boxShadow: '0 0 0 2px transparent',
      },
      default: {
        color: '#FFFFFF',
        backgroundColor: '#0052CC',
        boxShadow: '0 0 0 2px transparent',
      },
      focus: {
        color: '#FFFFFF',
        backgroundColor: '#0052CC',
        boxShadow: '0 0 0 2px rgb(128,169,230)',
      },
      hover: {
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 82, 204, 0.9)',
        boxShadow: '0 0 0 2px transparent',
      },
      selected: { color: '', backgroundColor: '', boxShadow: '' },
    },
    iconButton: {
      active: {
        color: '#42526E',
        backgroundColor: 'rgba(222, 235, 255, 0.6)',
        boxShadow: '',
      },
      default: {
        color: '#344563',
        backgroundColor: 'transparent',
        boxShadow: '',
      },
      focus: {
        color: '#344563',
        backgroundColor: 'rgba(222, 235, 255, 0.5)',
        boxShadow: '0 0 0 2px #2684FF',
      },
      hover: {
        color: '#42526E',
        backgroundColor: 'rgba(222, 235, 255, 0.9)',
        boxShadow: '',
      },
      selected: { color: '', backgroundColor: '', boxShadow: '' },
    },
    navigation: { backgroundColor: '#FFFFFF', color: '#6B778C' },
    productHome: {
      backgroundColor: '#0052CC',
      color: 'rgba(13, 20, 36, 0.97)',
      borderRight: '1px solid rgba(107, 119, 140, 0.3)',
    },
    primaryButton: {
      active: {
        color: '#344563',
        backgroundColor: 'rgba(222, 235, 255, 0.7)',
        boxShadow: '0 0 0 2px transparent',
      },
      default: {
        color: '#344563',
        backgroundColor: 'transparent',
        boxShadow: '0 0 0 2px transparent',
      },
      focus: {
        color: '#344563',
        backgroundColor: '',
        boxShadow: '0 0 0 2px #2684FF',
      },
      hover: {
        color: '#344563',
        backgroundColor: 'rgba(222, 235, 255, 0.9)',
        boxShadow: '0 0 0 2px transparent',
      },
      selected: {
        color: '#0052CC',
        backgroundColor: '',
        boxShadow: '',
        bordorBottom: '4px solid #0052CC',
      },
    },
    search: {
      default: {
        backgroundColor: '#FFFFFF',
        color: '#6B778C',
        borderColor: '#DFE1E6',
      },
      focus: {
        borderColor: '#2684FF',
      },
    },
    skeleton: { backgroundColor: 'rgba(13, 20, 36, 0.97)', opacity: 0.15 },
  },
};
