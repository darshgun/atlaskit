/* eslint-disable prefer-rest-params */

import getTheme from './getTheme';
import { ThemedValue, ThemeProps } from '../types';

type Value = string | number;
interface Modes { light: Value, dark: Value };
interface VariantModes { [string]: Modes };

function themedVariants(variantProp, variants) {
  return (props: ?ThemeProps) => {
    const theme = getTheme(props);
    if (props && props[variantProp] && variants) {
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
  variantModes: ?VariantModes,
): ThemedValue {
  if (typeof modesOrVariant === 'string') {
    return themedVariants(modesOrVariant, variantModes);
  }
  const modes = modesOrVariant;
  return (props: ?ThemeProps) => {
    const theme = getTheme(props);
    return modes[theme.mode];
  };
}
