import getTheme from './getTheme';
import { ThemedValue, ThemeProps, ThemeModes, Theme } from '../types';

type Value = string | number;
type Modes = { [key in ThemeModes]: Value };

export default function themed(
  modesOrVariant: Modes | string,
  modesMap?: { [key: string]: Modes },
): ThemedValue {
  // passed in a modes
  if (typeof modesOrVariant === 'object') {
    const modes: Modes = modesOrVariant;
    return function getValueFromMode(props: ThemeProps | undefined): Value {
      const theme: Theme = getTheme(props);
      return modes[theme.mode];
    };
  }

  // passed in variant and modesMap

  const variant: string = modesOrVariant;

  if (!modesMap) {
    console.error('Expected map to be passed in with variant');
    return () => '';
  }

  return function getValueFromVariant(props: ThemeProps | undefined): Value {
    if (!props) {
      return '';
    }

    // Need to ignore as we are doing a lookup on ThemeProps which doesn't support lookups
    // @ts-ignore
    const value: unknown = props[variant];

    if (typeof value !== 'string') {
      return '';
    }

    const modes: Modes | undefined = modesMap[value];

    if (!modes) {
      return '';
    }

    const theme: Theme = getTheme(props);
    return modes[theme.mode];
  };
}
