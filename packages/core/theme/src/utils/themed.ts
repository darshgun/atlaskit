/* eslint-disable prefer-rest-params */

import getTheme from './getTheme';
import { ThemedValue, ThemeProps } from '../types';

type Value = string | number;

type Modes<V> = Partial<{
  light: V;
  dark: V;
}>;

type VariantModes<V> = { [index: string]: Modes<V> };

function themedVariants<V>(variantProp: string, variants?: VariantModes<V>) {
  return (props?: ThemeProps & VariantModes<V>) => {
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

export default function themed<V = Value>(
  modesOrVariant: Modes<V> | string,
  variantModes?: VariantModes<V>,
): ThemedValue<V> {
  if (typeof modesOrVariant === 'string') {
    // @ts-ignore
    return themedVariants<V>(modesOrVariant, variantModes);
  }
  return (props?: Record<string, any>) => {
    const theme = getTheme(props);
    return modesOrVariant[theme.mode]!; // TODO Potentially revisit the fact that Mode cant be an empty object and break things
  };
}
