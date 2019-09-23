/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';
import { defaultAttributesFn } from '../utils';
import { LabelTextProps, LabelTextCSSProps } from '../types';

export const labelTextCSS = ({ tokens }: LabelTextCSSProps): CSSObject => ({
  paddingTop: tokens.label.spacing.top,
  paddingRight: tokens.label.spacing.right,
  paddingBottom: tokens.label.spacing.bottom,
  paddingLeft: tokens.label.spacing.left,
});

export function LabelText({
  attributesFn,
  tokens,
  cssFn,
  ...rest
}: LabelTextProps) {
  return <span {...attributesFn({})} css={cssFn({ tokens })} />;
}

export default {
  component: LabelText,
  cssFn: labelTextCSS,
  attributesFn: defaultAttributesFn,
};
