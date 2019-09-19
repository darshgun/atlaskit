import { CSSObject } from '@emotion/core';

export type CSSProperties = CSSObject & {
  backgroundColor: string;
  color: string;
};

export type ButtonCSSProperties = CSSProperties & {
  boxShadow: string;
};

export type ButtonCSSContext = {
  default: ButtonCSSProperties;
  hover: ButtonCSSProperties;
  focus: ButtonCSSProperties;
  active: ButtonCSSProperties;
};

export type CreateCSS = ButtonCSSContext;

export type IconButtonCSS = ButtonCSSContext;

export type PrimaryButtonCSS = ButtonCSSContext;

export type NavigationCSS = CSSProperties;

export type SearchCSS = CSSProperties;

export type SkeletonCSS = CSSObject & { backgroundColor: string };

// This is the shape of a theme 'mode', e.g. light, dark, or custom
export type Mode = {
  create: CreateCSS;
  iconButton: IconButtonCSS;
  navigation: NavigationCSS;
  search: SearchCSS;
  skeleton: SkeletonCSS;
  primaryButton: PrimaryButtonCSS;
};

export type NavigationTheme = {
  mode: Mode;
};
