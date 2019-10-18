/* eslint-disable prefer-rest-params */

import getTheme from './getTheme';
import { ThemedValue, ThemeProps } from '../types';

type Value = string | number;
type Modes = Partial<{
  light: Value;
  dark: Value;
  [index: string]: Value;
}>;
type VariantModes = { [key: string]: Modes };

function themedVariants(variantProp: string, variants?: VariantModes) {
  return (props?: ThemeProps & VariantModes) => {
    const theme = getTheme(props);
    if (props && props.variantProp && variants) {
      // @ts-ignore
      const modes = variants[props[variantProp]];
      if (modes) {
        return modes[theme.mode];
      }
    }
    return '';
  };
}

export default function themed(
  modesOrVariant: Modes | string,
  variantModes?: VariantModes,
): ThemedValue {
  if (typeof modesOrVariant === 'string') {
    // @ts-ignore
    return themedVariants(modesOrVariant, variantModes);
  }
  return (props?: Record<string, any>) => {
    const theme = getTheme(props);
    return modesOrVariant[theme.mode]!; // TODO Potentially revisit the fact that Mode cant be an empty object and break things
  };
}
