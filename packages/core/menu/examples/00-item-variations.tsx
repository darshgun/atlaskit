import React from 'react';
import { HashRouter, Link } from 'react-router-dom';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import StarIcon from '@atlaskit/icon/glyph/star';

import {
  ButtonItem,
  LinkItem,
  CustomItem,
  HeadingItem,
  SkeletonItem,
  SkeletonHeadingItem,
} from '../src';

const RouterLink = ({ wrapperClass, ...rest }: { wrapperClass: string }) => (
  <Link to="/my-route" className={wrapperClass} {...rest} />
);

const Emphasis = ({ wrapperClass, ...props }: { wrapperClass: string }) => (
  <em className={wrapperClass} {...props} />
);

const ItemVariants = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <HeadingItem testId="heading-item">This is a heading Item</HeadingItem>
      <ButtonItem testId="item-button">Regular Item</ButtonItem>
      <ButtonItem
        testId="item-button-before"
        elemBefore={<EmojiCustomIcon label="Icon before" />}
      >
        With elemBefore prop
      </ButtonItem>
      <ButtonItem
        testId="item-button-after"
        elemAfter={<StarIcon label="Icon before" />}
      >
        With elemAfter prop
      </ButtonItem>
      <ButtonItem
        testId="item-button-before-after"
        elemBefore={<EmojiCustomIcon label="icon before" />}
        elemAfter={<StarIcon label="icon after" />}
      >
        With both elemAfter and elemBefore prop
      </ButtonItem>
      <ButtonItem testId="item-button-disabled" isDisabled>
        Disabled Item
      </ButtonItem>
      <ButtonItem testId="item-button-selected" isSelected>
        Selected Item
      </ButtonItem>
      <ButtonItem
        testId="item-button-description"
        description="Some textual description"
      >
        Item with description
      </ButtonItem>
      <LinkItem testId="item-link" href="//www.atlassian.com">
        Link item that takes you to atlassian home page
      </LinkItem>
      <LinkItem
        testId="item-link-selected"
        href="//www.atlassian.com"
        isSelected
      >
        Selected Link Item
      </LinkItem>
      <CustomItem testId="item-custom-em" isDisabled component={Emphasis}>
        Disabled custom element using em tag
      </CustomItem>
      <HashRouter>
        <CustomItem
          component={RouterLink}
          testId="item-custom-router"
          description="some custom text"
          isSelected
          elemAfter={<StarIcon label="icon after" />}
          elemBefore={<EmojiCustomIcon label="icon before" />}
        >
          I'm a react-router link rendered using CustomItem
        </CustomItem>
      </HashRouter>
      <SkeletonHeadingItem testId="skeleton-heading-item" />
      <SkeletonItem testId="skeleton-item" />
      <SkeletonItem testId="skeleton-item-avatar" hasAvatar />
      <SkeletonItem testId="skeleton-item-icon" hasIcon />
      <SkeletonItem testId="skeleton-item-width" hasIcon width="100%" />
    </div>
  );
};

export default ItemVariants;
