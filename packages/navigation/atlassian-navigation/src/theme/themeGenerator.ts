import chromatism, { ColourModes } from 'chromatism';

import { NavigationTheme, ButtonCSSContext } from './types';

const getBoxShadow = (color: string) => `0 0 0 2px ${color}`;

/**
 * Mixes color2 with color1 by the specified weight. This is effectively a simple rgba to rgb conversion.
 */
const mix = (
  color1: ColourModes.RGB,
  color2: ColourModes.RGB,
  weight: number,
): ColourModes.CSSRGB => {
  const weightDistance = 1 - weight;
  const normalize = ({ r, g, b }: ColourModes.RGB) => ({
    r: r / 255,
    g: g / 255,
    b: b / 255,
  });
  const normalizedBackground = normalize(color1);
  const normalizedColor = normalize(color2);

  const red = Math.round(
    (weightDistance * normalizedBackground.r + weight * normalizedColor.r) *
      255,
  );
  const green = Math.round(
    (weightDistance * normalizedBackground.g + weight * normalizedColor.g) *
      255,
  );
  const blue = Math.round(
    (weightDistance * normalizedBackground.b + weight * normalizedColor.b) *
      255,
  );

  return `rgb(${red}, ${green}, ${blue})`;
};

const generateCSSStates = (colors: Colors): ButtonCSSContext => {
  const { backgroundColor, color } = colors;
  const backgroundColorRgb = chromatism.convert(backgroundColor).rgb;
  const contrastBackgroundColorRgb = chromatism.contrastRatio(backgroundColor)
    .rgb;
  const colorRgb = chromatism.convert(color).rgb;

  return {
    active: {
      backgroundColor: mix(
        backgroundColorRgb,
        contrastBackgroundColorRgb,
        0.13,
      ),
      boxShadow: getBoxShadow('transparent'),
      color,
    },
    default: {
      backgroundColor,
      boxShadow: getBoxShadow('transparent'),
      color,
    },
    focus: {
      boxShadow: getBoxShadow(mix(backgroundColorRgb, colorRgb, 0.5)),
      color,
    },
    hover: {
      backgroundColor: mix(
        backgroundColorRgb,
        contrastBackgroundColorRgb,
        0.08,
      ),
      boxShadow: getBoxShadow('transparent'),
      color,
    },
  };
};

export type Colors = {
  backgroundColor: string;
  color: string;
};

export type GenerateThemeArgs = {
  name?: string;
  primary: Colors;
  secondary?: Colors;
};

export const generateTheme = (args: GenerateThemeArgs): NavigationTheme => {
  const { primary: primaryColors, secondary: secondaryColors } = args;
  const primary = generateCSSStates(primaryColors);
  const { active: primaryActive, default: primaryDefault } = primary;
  const backgroundColorRgb = chromatism.convert(primaryColors.backgroundColor)
    .rgb;
  const contrastBackgroundColor = chromatism.contrastRatio(backgroundColorRgb);

  const secondary = secondaryColors
    ? generateCSSStates(secondaryColors)
    : generateCSSStates({
        backgroundColor: mix(
          backgroundColorRgb,
          contrastBackgroundColor.rgb,
          0.13,
        ),
        color: primaryColors.color,
      });

  return {
    mode: {
      create: secondary,
      iconButton: primary,
      navigation: {
        backgroundColor: primaryDefault.backgroundColor,
        color: primaryDefault.color,
      },
      primaryButton: primary,
      search: {
        backgroundColor: primaryActive.backgroundColor,
        color: primaryActive.color,
      },
      skeleton: {
        backgroundColor: contrastBackgroundColor.hex,
      },
    },
  };
};
