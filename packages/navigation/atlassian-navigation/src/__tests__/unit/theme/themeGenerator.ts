// import { generateTheme, GenerateThemeArgs } from '../../../';

import { generateThemes } from '../../../theme/themeGenerator';
import { GenerateThemesArgs, Mode } from '../../../theme/types';

describe('generateTheme', () => {
  let atlassianTheme: GenerateThemesArgs = {
    name: 'atlassian',
    highlightColor: '#0052CC',
    backgroundColor: '#FFFFFF',
  };

  let atlassianThemeObject: { mode: Mode } = {
    mode: {
      create: {
        active: {
          color: '#FFFFFF',
          backgroundColor: 'rgb(33,104,211)',
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
          backgroundColor: 'rgb(20,96,208)',
          boxShadow: '0 0 0 2px transparent',
        },
        selected: { color: '', backgroundColor: '', boxShadow: '' },
      },
      iconButton: {
        active: {
          color: '#42526E',
          backgroundColor: 'rgba(222, 235, 255, 0.3)',
          boxShadow: '',
          opacity: 0.5,
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
      primaryButton: {
        active: {
          color: '#344563',
          backgroundColor: 'rgba(222, 235, 255, 0.5)',
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
          backgroundColor: 'rgba(222, 235, 255, 0.5)',
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
        backgroundColor: '#FFFFFF',
        color: '#6B778C',
        border: '2px solid #DFE1E6',
      },
      skeleton: { backgroundColor: 'rgba(13, 20, 36, 0.97)', opacity: 0.15 },
    },
  };

  describe('default atlassian theme', () => {
    const generatedDefaultTheme = generateThemes(atlassianTheme).mode;

    type Component =
      | 'search'
      | 'skeleton'
      | 'primaryButton'
      | 'navigation'
      | 'iconButton'
      | 'create';

    Object.keys(generatedDefaultTheme).forEach(component => {
      it(`should match theme object for ${component}`, () => {
        const componentTheme = generatedDefaultTheme[component as Component];

        expect(componentTheme).toEqual(
          expect.objectContaining(
            atlassianThemeObject.mode[component as Component],
          ),
        );
      });
    });
  });
});
