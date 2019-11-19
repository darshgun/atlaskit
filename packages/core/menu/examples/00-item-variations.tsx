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

const CustomComponent = ({
  wrapperClass,
  ...rest
}: {
  wrapperClass: string;
}) => (
  <Link
    to="/my-route"
    className={wrapperClass}
    style={{ color: 'currentColor' }}
    {...rest}
  />
);

const ItemVariants = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <HeadingItem>This is a heading Item</HeadingItem>
      <ButtonItem>Regular Item</ButtonItem>
      <ButtonItem elemBefore={<EmojiCustomIcon label="Icon before" />}>
        With elemBefore prop
      </ButtonItem>
      <ButtonItem elemAfter={<StarIcon label="Icon before" />}>
        With elemAfter prop
      </ButtonItem>
      <ButtonItem
        elemBefore={<EmojiCustomIcon label="icon before" />}
        elemAfter={<StarIcon label="icon after" />}
      >
        With both elemAfter and elemBefore prop
      </ButtonItem>
      <ButtonItem isDisabled>Disabled Item</ButtonItem>
      <ButtonItem isSelected>Selected Item</ButtonItem>
      <ButtonItem description="Some textual description">
        Disabled Item
      </ButtonItem>
      <LinkItem href="//www.atlassian.com">
        Link item that takes you to atlassian home page
      </LinkItem>
      <LinkItem href="//www.atlassian.com" isSelected>
        Selected Link Item
      </LinkItem>
      <SkeletonHeadingItem />
      <SkeletonItem />
      <SkeletonItem hasAvatar />
      <SkeletonItem hasIcon />
      <SkeletonItem hasIcon width="100%" />
    </div>
  );
};

export default ItemVariants;
