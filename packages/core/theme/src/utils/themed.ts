/* eslint-disable prefer-rest-params */

import getTheme from './getTheme';
import { ThemedValue, ThemeProps, ThemeModes } from '../types';

type Value = string | number;

type Modes<V> = { [key in ThemeModes]: V };

type VariantModes<V> = { [index: string]: Modes<V> };

function themedVariants<V>(variantProp: string, variants?: VariantModes<V>) {
  return (props?: ThemeProps & VariantModes<V>) => {
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

export default function themed<V = Value>(
  modesOrVariant: Modes<V> | string,
  variantModes?: VariantModes<V>,
): ThemedValue<V> {
  if (typeof modesOrVariant === 'string') {
    return themedVariants<V>(modesOrVariant, variantModes);
  }
  const modes = modesOrVariant;
  return (props?: ThemeProps) => {
    const theme = getTheme(props);
    // If user provides only light or dark and the other is called, return empty string
    if (theme.mode in modes) {
      return modes[theme.mode];
    } else {
      return '';
    }
  };
}
