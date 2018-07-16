// @flow
import {
  codeFontFamily,
  borderRadius,
  gridSize,
  fontSize,
} from '@atlaskit/theme';

import { defaultColors } from './defaultTheme';

export type ThemeModes = 'light' | 'dark';
export type ThemeProps = {
  __ATLASKIT_THEME__: { mode: ThemeModes },
};

export type Theme = {
  lineNumberColor?: string | number,
  lineNumberBgColor?: string | number,
  backgroundColor?: string | number,
  textColor?: string | number,
  substringColor?: string | number,
  keywordColor?: string | number,
  attributeColor?: string | number,
  selectorTagColor?: string | number,
  docTagColor?: string | number,
  nameColor?: string | number,
  builtInColor?: string | number,
  literalColor?: string | number,
  bulletColor?: string | number,
  codeColor?: string | number,
  additionColor?: string | number,
  regexpColor?: string | number,
  symbolColor?: string | number,
  variableColor?: string | number,
  templateVariableColor?: string | number,
  linkColor?: string | number,
  selectorAttributeColor?: string | number,
  selectorPseudoColor?: string | number,
  typeColor?: string | number,
  stringColor?: string | number,
  selectorIdColor?: string | number,
  selectorClassColor?: string | number,
  quoteColor?: string | number,
  templateTagColor?: string | number,
  deletionColor?: string | number,
  titleColor?: string | number,
  sectionColor?: string | number,
  commentColor?: string | number,
  metaKeywordColor?: string | number,
  metaColor?: string | number,
  functionColor?: string | number,
  numberColor?: string | number,
};

const codeContainerStyle = {
  fontFamily: codeFontFamily,
  fontSize: '12px',
  top: gridSize(),
  left: '16px', // 2x akGridSize
  position: 'relative',
  paddingRight: '16px', // 2x akGridSize
  display: 'inline-block',
};

const lineNumberContainerStyle = (theme: Theme) => ({
  fontSize: `${fontSize()}px`,
  lineHeight: '20px',
  color: theme.lineNumberColor,
  backgroundColor: theme.lineNumberBgColor,
  padding: gridSize(),
  float: 'left',
  top: '0',
  left: '0',
  textAlign: 'right',
  userSelect: 'none',
});

const codeBlockStyle = (theme: Theme) => ({
  // These properties map to highlightjs css selectors
  hljs: {
    fontFamily: codeFontFamily,
    fontSize: '12px',
    lineHeight: '20px',
    background: theme.backgroundColor,
    color: theme.textColor,
    borderRadius: borderRadius(),
    display: 'block',
    overflowX: 'auto',
    whiteSpace: 'pre',
    paddingRight: '16px',
    transform: 'translate3d(0,0,0)',
  },
  'hljs-subst': {
    color: theme.substringColor,
  },
  'hljs-keyword': {
    color: theme.keywordColor,
    fontWeight: 'bolder',
  },
  'hljs-attribute': {
    color: theme.attributeColor,
  },
  'hljs-selector-tag': {
    color: theme.selectorTagColor,
  },
  'hljs-doctag': {
    color: theme.docTagColor,
  },
  'hljs-name': {
    color: theme.nameColor,
  },
  'hljs-built_in': {
    color: theme.builtInColor,
  },
  'hljs-literal': {
    color: theme.literalColor,
  },
  'hljs-bullet': {
    color: theme.bulletColor,
  },
  'hljs-code': {
    color: theme.codeColor,
  },
  'hljs-addition': {
    color: theme.additionColor,
  },
  'hljs-regexp': {
    color: theme.regexpColor,
  },
  'hljs-symbol': {
    color: theme.symbolColor,
  },
  'hljs-variable': {
    color: theme.variableColor,
  },
  'hljs-template-variable': {
    color: theme.templateVariableColor,
  },
  'hljs-link': {
    color: theme.linkColor,
  },
  'hljs-selector-attr': {
    color: theme.selectorAttributeColor,
  },
  'hljs-selector-pseudo': {
    color: theme.selectorPseudoColor,
  },
  'hljs-type': {
    color: theme.typeColor,
  },
  'hljs-string': {
    color: theme.stringColor,
  },
  'hljs-selector-id': {
    color: theme.selectorIdColor,
  },
  'hljs-selector-class': {
    color: theme.selectorClassColor,
  },
  'hljs-quote': {
    color: theme.quoteColor,
  },
  'hljs-template-tag': {
    color: theme.templateTagColor,
  },
  'hljs-deletion': {
    color: theme.deletionColor,
  },
  'hljs-title': {
    color: theme.titleColor,
  },
  'hljs-section': {
    color: theme.sectionColor,
  },
  'hljs-comment': {
    color: theme.commentColor,
    fontFamily: `SFMono-MediumItalic, ${codeFontFamily()}`,
    fontStyle: 'italic',
  },
  'hljs-meta-keyword': {
    color: theme.metaKeywordColor,
  },
  'hljs-meta': {
    color: theme.metaColor,
  },
  'hljs-emphasis': {
    fontStyle: 'italic',
  },
  'hljs-strong': {
    fontWeight: 'bolder',
  },
  'hljs-function': {
    color: theme.functionColor,
  },
  'hljs-number': {
    color: theme.numberColor,
  },
});

const inlineCodeStyle = (theme: Theme) => ({
  hljs: {
    fontFamily: codeFontFamily,
    fontSize: '12px',
    background: theme.backgroundColor,
    color: theme.textColor,
    borderRadius: borderRadius(),
    display: 'inline',
    overflowX: 'auto',
    padding: '2px 4px',
    transform: 'translate3d(0,0,0)',
  },
});

export function applyTheme(theme: ThemeProps | Theme = {}) {
  const newTheme = { ...defaultColors(theme), ...theme };
  return {
    lineNumberContainerStyle: lineNumberContainerStyle(newTheme),
    codeBlockStyle: codeBlockStyle(newTheme),
    inlineCodeStyle: {
      ...codeBlockStyle(newTheme),
      ...inlineCodeStyle(newTheme),
    },
    codeContainerStyle,
  };
}
