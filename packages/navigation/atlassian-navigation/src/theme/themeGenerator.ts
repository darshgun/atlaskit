import defaultTheme, { DEFAULT_THEME_NAME } from './defaultTheme';
import {
  hexToRGBA,
  getBoxShadow,
  generateTextColor,
  getContrastColor,
} from './themeHelpers';
import { GenerateThemeArgs, NavigationTheme, ButtonCSSContext } from './types';

type Colors = {
  backgroundColor: string;
  color: string;
  highlightColor: string;
};

type ButtonType = 'create' | 'iconButton' | 'primaryButton';
const generateButtonCSSStates = (
  colors: Colors,
  buttonType: ButtonType,
): ButtonCSSContext => {
  const { backgroundColor, color, highlightColor } = colors;

  // Add less opacity for white text so it is still legible.
  const opacityValue = color === '#000000' ? 0.3 : 0.6;
  const isCreateButton = buttonType === 'create';

  return {
    active: {
      backgroundColor: isCreateButton
        ? hexToRGBA(backgroundColor, 0.65)
        : getContrastColor(0.3, opacityValue, backgroundColor),
      boxShadow: getBoxShadow('transparent'),
      color,
    },
    default: {
      backgroundColor,
      boxShadow: getBoxShadow('transparent'),
      color,
    },
    focus: {
      boxShadow: getBoxShadow(hexToRGBA(highlightColor, 0.5)),
      color,
      backgroundColor,
    },
    hover: {
      backgroundColor: isCreateButton
        ? hexToRGBA(backgroundColor, 0.8)
        : getContrastColor(0.1, opacityValue, backgroundColor),
      boxShadow: getBoxShadow('transparent'),
      color,
    },
    selected: {
      color: highlightColor,
      backgroundColor,
      boxShadow: getBoxShadow('transparent'),
    },
  };
};

const generateCreateButtonColors = (
  themeBackground: string,
  themeHighlight: string,
) => ({
  backgroundColor: themeHighlight,
  color: generateTextColor(themeHighlight),
  highlightColor: themeHighlight,
});

export const generateTheme = (
  themeColors: GenerateThemeArgs,
): NavigationTheme => {
  const { backgroundColor, highlightColor, name } = themeColors;
  const color = generateTextColor(backgroundColor);
  const colors = { ...themeColors, color };

  if (name === DEFAULT_THEME_NAME) {
    return defaultTheme;
  }

  return {
    mode: {
      create: generateButtonCSSStates(
        generateCreateButtonColors(backgroundColor, highlightColor),
        'create',
      ),
      iconButton: generateButtonCSSStates(colors, 'iconButton'),
      primaryButton: generateButtonCSSStates(colors, 'primaryButton'),
      navigation: {
        backgroundColor,
        color,
      },
      productHome: {
        color,
        backgroundColor: highlightColor,
        borderRight: `1px solid ${hexToRGBA(color, 0.5)}`,
      },
      search: {
        default: {
          backgroundColor,
          color,
          borderColor: hexToRGBA(color, 0.5),
        },
        focus: {
          borderColor: hexToRGBA(highlightColor, 0.8),
        },
      },
      skeleton: { backgroundColor: color, opacity: 0.3 },
    },
  };
};
