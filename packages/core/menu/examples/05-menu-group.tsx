import React from 'react';
// import {
//   MenuGroup,
//   Section,
//   Item,
//   LinkItem,
//   HeadingItem,
//   SkeletonItem,
// SkeletonHeadingItem,
// } from '../src';

// Temporarily imported from here until all components are ready.
import StarIcon from '@atlaskit/icon/glyph/star';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import Blog24Icon from '@atlaskit/icon-object/glyph/blog/24';

import {
  Item,
  LinkItem,
  HeadingItem,
  SkeletonItem,
  SkeletonHeadingItem,
} from '../src/MenuItem';
import { MenuGroup, Section } from '../src/Group';

export default () => {
  return (
    <div
      style={{
        width: '600px',
        border: '1px solid #EFEFEF',
        margin: '10px auto',
        borderRadius: '4px',
      }}
    >
      <MenuGroup maxHeight={500}>
        <Section>
          <HeadingItem>Items with elemBefore and elemAfter</HeadingItem>
          <LinkItem elemBefore={<EditorSearchIcon />} href="#">
            Item link
          </LinkItem>
          <LinkItem elemBefore={<EmojiCustomIcon />} href="#">
            Item link
          </LinkItem>
          <LinkItem elemAfter={<StarIcon />} href="#">
            Item link
          </LinkItem>
          <LinkItem
            elemBefore={<Blog24Icon />}
            elemAfter={<ArrowRightCircleIcon />}
            href="#"
          >
            Item link
          </LinkItem>
        </Section>
        <Section isScrollable shouldShowSeparator>
          <HeadingItem>Scrollable section with separator</HeadingItem>
          <Item elemBefore="hi" elemAfter="bye">
            Item
          </Item>
          <Item elemBefore="hi" elemAfter="bye">
            Item
          </Item>
          <Item
            elemBefore="hi"
            elemAfter="bye"
            description="Some textual description"
          >
            Item
          </Item>
          <Item elemBefore="hi" elemAfter="bye">
            Item
          </Item>
          <Item elemBefore="hi" elemAfter="bye">
            Item
          </Item>
          <Item elemBefore="hi" elemAfter="bye">
            Item
          </Item>
          <Item elemBefore="hi" elemAfter="bye">
            Item
          </Item>
          <Item elemBefore="hi" elemAfter="bye">
            Item
          </Item>
        </Section>
        <Section>
          <SkeletonHeadingItem />
          <SkeletonItem />
          <SkeletonItem />
        </Section>
      </MenuGroup>
    </div>
  );
};
