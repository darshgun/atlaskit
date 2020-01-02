/** @jsx jsx */
import { jsx, ClassNames } from '@emotion/core';
import {
  linkItemCSS,
  customItemCSS,
  itemCSS,
  itemHeadingCSS,
  skeletonHeadingItemCSS,
  itemSkeletonCSS,
  elemBeforeCSS,
  elemAfterCSS,
  descriptionCSS,
  contentCSS,
  truncateCSS,
  contentCSSWrapper,
} from './styles';

import {
  ButtonItemProps,
  LinkItemProps,
  BaseItemProps,
  CustomItemProps,
  SkeletonItemProps,
  HeadingItemProps,
  SkeletonHeadingItemProps,
} from '../types';

export const HeadingItem = ({ children, testId }: HeadingItemProps) => (
  <div css={itemHeadingCSS} data-testid={testId}>
    {children}
  </div>
);

export const SkeletonHeadingItem = ({
  width,
  testId,
  isShimmering,
}: SkeletonHeadingItemProps) => (
  <div css={skeletonHeadingItemCSS(width, isShimmering)} data-testid={testId} />
);

export const SkeletonItem = ({
  hasAvatar,
  hasIcon,
  width,
  testId,
  isShimmering,
}: SkeletonItemProps) => (
  <div
    css={itemSkeletonCSS(hasAvatar, hasIcon, width, isShimmering)}
    data-testid={testId}
  />
);

const BaseItem = ({
  elemBefore,
  elemAfter,
  children,
  description,
}: BaseItemProps) => {
  return (
    <div css={contentCSSWrapper}>
      {elemBefore && <span css={elemBeforeCSS}>{elemBefore}</span>}
      {children && (
        <span css={contentCSS}>
          <span css={truncateCSS}>{children}</span>
          {description && <span css={descriptionCSS}>{description}</span>}
        </span>
      )}
      {elemAfter && <span css={elemAfterCSS}>{elemAfter}</span>}
    </div>
  );
};

export const ButtonItem = (props: ButtonItemProps) => {
  const {
    elemBefore,
    elemAfter,
    children,
    description,
    isDisabled = false,
    isSelected = false,
    testId,
    ...others
  } = props;

  if (!children) {
    return null;
  }

  const Container = isDisabled ? 'span' : 'button';

  return (
    <Container
      type={isDisabled ? undefined : 'button'}
      css={itemCSS(isDisabled, isSelected)}
      data-testid={testId}
      {...others}
    >
      <BaseItem
        elemBefore={elemBefore}
        elemAfter={elemAfter}
        description={description}
      >
        {children}
      </BaseItem>
    </Container>
  );
};

export const LinkItem = ({ href, ...rest }: LinkItemProps) => {
  const {
    elemBefore,
    elemAfter,
    children,
    description,
    isDisabled = false,
    isSelected = false,
    testId,
    ...others
  } = rest;

  if (!children) {
    return null;
  }

  const Container = isDisabled ? 'span' : 'a';

  return (
    <Container
      css={linkItemCSS(isDisabled, isSelected)}
      href={isDisabled ? undefined : href}
      data-testid={testId}
      {...others}
    >
      <BaseItem
        elemBefore={elemBefore}
        elemAfter={elemAfter}
        description={description}
      >
        {children}
      </BaseItem>
    </Container>
  );
};

export const CustomItem = ({
  component: Component,
  isDisabled,
  isSelected,
  ...rest
}: CustomItemProps) => {
  if (!Component) {
    return null;
  }

  return (
    <ClassNames>
      {({ css }) => (
        <Component wrapperClass={css(customItemCSS(isDisabled, isSelected))}>
          <BaseItem {...rest} />
        </Component>
      )}
    </ClassNames>
  );
};
