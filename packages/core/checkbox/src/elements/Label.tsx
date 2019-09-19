/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';
import { defaultAttributesFn } from '../utils';
import { LabelProps, LabelCSSProps } from '../types';

export const labelCSS = ({ isDisabled, tokens }: LabelCSSProps): CSSObject => ({
  alignItems: 'flex-start',
  display: 'flex',
  color: isDisabled
    ? tokens.label.textColor.disabled
    : tokens.label.textColor.rest,
  ...(isDisabled && { cursor: 'not-allowed' }),
});

export function Label({
  children,
  onMouseUp,
  onMouseDown,
  onMouseLeave,
  onMouseEnter,
  attributesFn,
  isDisabled,
  tokens,
  cssFn,
}: LabelProps) {
  return (
    <label
      {...attributesFn({})}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      css={cssFn({ isDisabled, tokens })}
    >
      {children}
    </label>
  );
}

export default {
  component: Label,
  cssFn: labelCSS,
  attributesFn: defaultAttributesFn,
};
