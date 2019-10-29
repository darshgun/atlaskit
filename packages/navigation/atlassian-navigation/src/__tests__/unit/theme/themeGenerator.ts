// import { generateTheme, GenerateThemeArgs } from '../../../';

import { generateThemes } from '../../../theme/themeGenerator';
import { GenerateThemesArgs, Mode } from '../../../theme/types';

describe('generateTheme', () => {
  let atlassianTheme: GenerateThemesArgs;
  let atlassianThemeObject: { mode: Mode };

  beforeEach(() => {
    atlassianTheme = {
      name: 'atlassian',
      highlightColor: '#0052CC',
      backgroundColor: '#FFFFFF',
    };

    atlassianThemeObject = {
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
            backgroundColor: '#DEEBFF',
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
            backgroundColor: '#0052CC',
            boxShadow: '0 0 0 2px rgb(154,162,177)',
          },
          hover: {
            color: '#42526E',
            backgroundColor: '#DEEBFF',
            boxShadow: '',
            opacity: 0.7,
          },
          selected: { color: '', backgroundColor: '', boxShadow: '' },
        },
        navigation: { backgroundColor: '#FFFFFF', color: '#000000' },
        primaryButton: {
          active: {
            color: '#344563',
            backgroundColor: '#EEF5FF',
            boxShadow: '0 0 0 2px transparent',
          },
          default: {
            color: '#344563',
            backgroundColor: '',
            boxShadow: '0 0 0 2px transparent',
          },
          focus: {
            color: '#344563',
            backgroundColor: '',
            boxShadow: '0 0 0 2px #2684FF',
          },
          hover: {
            color: '#344563',
            backgroundColor: '#EEF5FF',
            boxShadow: '0 0 0 2px transparent',
          },
          selected: {
            color: '',
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
        skeleton: { backgroundColor: '#000000', opacity: '0.15' },
      },
    };
  });

  describe('atlassian theme', () => {
    it('should match theme for create button', () => {
      const createButtonTheme = generateThemes(atlassianTheme).mode.create;

      expect(createButtonTheme).toMatchObject(atlassianThemeObject.mode.create);
    });
  });
});
