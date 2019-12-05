import { GenerateThemeArgs, Mode } from '../../../../theme/types';

export const colorSchemes: GenerateThemeArgs[] = [
  {
    name: 'atlassian',
    highlightColor: '#0052CC',
    backgroundColor: '#FFFFFF',
  },
  {
    name: 'custom white text',
    backgroundColor: '#E8CBD2',
    highlightColor: '#333333',
  },
  {
    name: 'custom black text',
    backgroundColor: '#272727',
    highlightColor: '#E94E34',
  },
];

type Themes = Array<{ mode: Mode }>;
export const themes: Themes = [
  {
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
          color: '#0052CC',
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
          color: '#0052CC',
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
        gradientStart: '#0052CC',
        gradientStop: '#2684FF',
        iconColor: '#2684FF',
        active: {
          backgroundColor: 'rgba(222, 235, 255, 0.7)',
          color: '#0052CC',
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
          color: '#0052CC',
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
      primaryButton: {
        active: {
          color: '#0052CC',
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
          color: '#0052CC',
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
      skeleton: {
        backgroundColor: '#F4F5F7',
        opacity: 1,
      },
    },
  },
  {
    mode: {
      create: {
        active: {
          backgroundColor: 'rgba(51, 51, 51, 0.65)',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        default: {
          backgroundColor: '#333333',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        focus: {
          boxShadow: '0 0 0 2px rgba(51, 51, 51, 0.5)',
          color: '#ffffff',
          backgroundColor: '#333333',
        },
        hover: {
          backgroundColor: 'rgba(51, 51, 51, 0.8)',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        selected: {
          color: '#333333',
          backgroundColor: '#333333',
          boxShadow: '0 0 0 2px transparent',
        },
      },
      iconButton: {
        active: {
          backgroundColor: 'rgba(159, 150, 152, 0.3)',
          boxShadow: '0 0 0 2px transparent',
          color: '#000000',
        },
        default: {
          backgroundColor: '#E8CBD2',
          boxShadow: '0 0 0 2px transparent',
          color: '#000000',
        },
        focus: {
          boxShadow: '0 0 0 2px rgba(51, 51, 51, 0.5)',
          color: '#000000',
          backgroundColor: '#E8CBD2',
        },
        hover: {
          backgroundColor: 'rgba(138, 135, 136, 0.3)',
          boxShadow: '0 0 0 2px transparent',
          color: '#000000',
        },
        selected: {
          color: '#333333',
          backgroundColor: '#E8CBD2',
          boxShadow: '0 0 0 2px transparent',
        },
      },
      primaryButton: {
        active: {
          backgroundColor: 'rgba(159, 150, 152, 0.3)',
          boxShadow: '0 0 0 2px transparent',
          color: '#000000',
        },
        default: {
          backgroundColor: '#E8CBD2',
          boxShadow: '0 0 0 2px transparent',
          color: '#000000',
        },
        focus: {
          boxShadow: '0 0 0 2px rgba(51, 51, 51, 0.5)',
          color: '#000000',
          backgroundColor: '#E8CBD2',
        },
        hover: {
          backgroundColor: 'rgba(138, 135, 136, 0.3)',
          boxShadow: '0 0 0 2px transparent',
          color: '#000000',
        },
        selected: {
          color: '#333333',
          backgroundColor: '#E8CBD2',
          boxShadow: '0 0 0 2px transparent',
        },
      },
      navigation: { backgroundColor: '#E8CBD2', color: '#000000' },
      productHome: {
        color: '#000000',
        backgroundColor: '#333333',
        borderRight: '1px solid rgba(0, 0, 0, 0.5)',
      },
      search: {
        default: {
          backgroundColor: '#E8CBD2',
          color: '#000000',
          borderColor: 'rgba(0, 0, 0, 0.5)',
        },
        focus: { borderColor: 'rgba(51, 51, 51, 0.8)' },
      },
      skeleton: { backgroundColor: '#000000', opacity: 0.3 },
    },
  },
  {
    mode: {
      create: {
        active: {
          backgroundColor: 'rgba(233, 78, 52, 0.65)',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        default: {
          backgroundColor: '#E94E34',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        focus: {
          boxShadow: '0 0 0 2px rgba(233, 78, 52, 0.5)',
          color: '#ffffff',
          backgroundColor: '#E94E34',
        },
        hover: {
          backgroundColor: 'rgba(233, 78, 52, 0.8)',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        selected: {
          color: '#E94E34',
          backgroundColor: '#E94E34',
          boxShadow: '0 0 0 2px transparent',
        },
      },
      iconButton: {
        active: {
          backgroundColor: 'rgba(101, 101, 101, 0.6)',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        default: {
          backgroundColor: '#272727',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        focus: {
          boxShadow: '0 0 0 2px rgba(233, 78, 52, 0.5)',
          color: '#ffffff',
          backgroundColor: '#272727',
        },
        hover: {
          backgroundColor: 'rgba(119, 119, 119, 0.6)',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        selected: {
          color: '#E94E34',
          backgroundColor: '#272727',
          boxShadow: '0 0 0 2px transparent',
        },
      },
      primaryButton: {
        active: {
          backgroundColor: 'rgba(101, 101, 101, 0.6)',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        default: {
          backgroundColor: '#272727',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        focus: {
          boxShadow: '0 0 0 2px rgba(233, 78, 52, 0.5)',
          color: '#ffffff',
          backgroundColor: '#272727',
        },
        hover: {
          backgroundColor: 'rgba(119, 119, 119, 0.6)',
          boxShadow: '0 0 0 2px transparent',
          color: '#ffffff',
        },
        selected: {
          color: '#E94E34',
          backgroundColor: '#272727',
          boxShadow: '0 0 0 2px transparent',
        },
      },
      navigation: { backgroundColor: '#272727', color: '#ffffff' },
      productHome: {
        color: '#ffffff',
        backgroundColor: '#E94E34',
        borderRight: '1px solid rgba(255, 255, 255, 0.5)',
      },
      search: {
        default: {
          backgroundColor: '#272727',
          color: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        focus: { borderColor: 'rgba(233, 78, 52, 0.8)' },
      },
      skeleton: { backgroundColor: '#ffffff', opacity: 0.3 },
    },
  },
];
