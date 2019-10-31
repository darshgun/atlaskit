// TODO: Fix imports
// import { generateTheme, GenerateThemeArgs } from '../../../';

import { generateTheme } from '../../../theme/themeGenerator';
import { atlassianColorScheme, atlassianTheme } from './_theme-data';

type Component =
  | 'search'
  | 'skeleton'
  | 'primaryButton'
  | 'navigation'
  | 'iconButton'
  | 'create';

describe('generateTheme', () => {
  describe('default atlassian theme', () => {
    const generatedDefaultTheme = generateTheme(atlassianColorScheme).mode;

    Object.keys(generatedDefaultTheme).forEach(component => {
      it(`should match theme object for "${component}"`, () => {
        const componentTheme = generatedDefaultTheme[component as Component];

        expect(Object.keys(componentTheme)).toEqual(
          Object.keys(atlassianTheme.mode[component as Component]),
        );
        expect(componentTheme).toEqual(
          expect.objectContaining(atlassianTheme.mode[component as Component]),
        );
      });
    });
  });
});
