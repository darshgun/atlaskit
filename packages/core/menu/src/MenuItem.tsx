/** @jsx jsx */
import { Fragment } from 'react';
import { jsx } from '@emotion/core';
import {
  linkItemCSS,
  itemCSS,
  itemHeadingCSS,
  skeletonHeadingItemCSS,
  itemSkeletonCSS,
  elemBeforeCSS,
  elemAfterCSS,
  descriptionCSS,
  contentCSS,
  contentCSSWrapper,
} from './styles';
import { ItemProps, LinkItemProps } from './types';

export const HeadingItem = ({ children }: { children: React.ReactNode }) => (
  <div css={itemHeadingCSS}>{children}</div>
);
export const SkeletonHeadingItem = () => <div css={skeletonHeadingItemCSS} />;
export const SkeletonItem = () => <div css={itemSkeletonCSS} />;

const ItemBase = ({
  elemBefore,
  elemAfter,
  children,
  description,
}: ItemProps) => {
  return (
    <Fragment>
      <div css={contentCSSWrapper}>
        {elemBefore && <span css={elemBeforeCSS}>{elemBefore}</span>}
        {children && <span css={contentCSS}>{children}</span>}
        {elemAfter && <span css={elemAfterCSS}>{elemAfter}</span>}
      </div>
      {description && <div css={descriptionCSS}>{description}</div>}
    </Fragment>
  );
};

export const Item = (props: ItemProps) => {
  const { elemBefore, elemAfter, children, description } = props;

  if (!children) {
    return null;
  }

  return (
    <button type="button" css={itemCSS}>
      <ItemBase
        elemBefore={elemBefore}
        elemAfter={elemAfter}
        description={description}
      >
        {children}
      </ItemBase>
    </button>
  );
};

export const LinkItem = ({ href, ...rest }: LinkItemProps) => {
  const { elemBefore, elemAfter, children, description, ...others } = rest;

  if (!children) {
    return null;
  }

  return (
    <a css={linkItemCSS} href={href} {...others}>
      <ItemBase
        elemBefore={elemBefore}
        elemAfter={elemAfter}
        description={description}
      >
        {children}
      </ItemBase>
    </a>
  );
};
