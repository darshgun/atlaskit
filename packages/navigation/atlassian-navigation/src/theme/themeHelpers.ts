import chromatism from 'chromatism';

export const hexToRGBA = (hex: string, opacity: number = 1) => {
  const rgba = { ...chromatism.convert(hex).rgb, ...{ a: opacity } };

  return `rgba(${Object.values(rgba).join(', ')})`;
};

export const getBoxShadow = (color: string) => `0 0 0 2px ${color}`;

export const generateTextColor = (color: string) =>
  chromatism.contrastRatio(color).hex;

export const getContrastColor = (
  contrastValue: number,
  opacityValue: number,
  color: string,
) => hexToRGBA(chromatism.contrast(contrastValue, color).hex, opacityValue);
