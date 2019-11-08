import React from 'react';
// import {
//   MenuGroup,
//   Section,
//   Item,
//   LinkItem,
//   HeadingItem,
//   SkeletonItem,
// } from '../src';

// Temporarily imported from here until all components are ready.
import { Item, LinkItem, HeadingItem, SkeletonItem } from '../src/MenuItem';
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
          <HeadingItem>Heading</HeadingItem>
          <LinkItem elemBefore="hi" elemAfter="bye" href="#">
            Item link
          </LinkItem>
          <LinkItem elemBefore="hi" elemAfter="bye" href="#">
            Item link
          </LinkItem>
          <LinkItem elemBefore="hi" elemAfter="bye" href="#">
            Item link
          </LinkItem>
        </Section>
        <Section isScrollable shouldShowSeparator>
          <HeadingItem>Heading</HeadingItem>
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
        </Section>
        <Section>
          <HeadingItem>Footer</HeadingItem>
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </Section>
      </MenuGroup>
    </div>
  );
};
