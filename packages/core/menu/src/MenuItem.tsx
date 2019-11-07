/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  linkItemCSS,
  itemCSS,
  itemHeadingCSS,
  itemSkeletonCSS,
  elemBeforeCSS,
  elemAfterCSS,
  descriptionCSS,
  contentCSS,
  contentCSSWrapper,
} from './styles';
import { ItemProps } from './types';

export const LinkItem = props => <a css={linkItemCSS} {...props} />;

export const HeadingItem = props => <div css={itemHeadingCSS} {...props} />;
export const SkeletonItem = props => <div css={itemSkeletonCSS} {...props} />;

export const Item = (props: ItemProps) => {
  const { elemBefore, elemAfter, children, description } = props;
  return (
    <button css={itemCSS}>
      <div css={contentCSSWrapper}>
        {elemBefore && <span css={elemBeforeCSS}>{elemBefore}</span>}
        {children && <span css={contentCSS}>{children}</span>}
        {elemAfter && <span css={elemAfterCSS}>{elemAfter}</span>}
      </div>
      {description && <div css={descriptionCSS}>{description}</div>}
    </button>
  );
};
