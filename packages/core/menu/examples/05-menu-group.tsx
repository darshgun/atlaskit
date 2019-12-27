import React from 'react';
import {
  MenuGroup,
  Section,
  ButtonItem,
  LinkItem,
  HeadingItem,
  SkeletonItem,
  SkeletonHeadingItem,
} from '../src';

import Archive24Icon from '@atlaskit/icon-file-type/glyph/archive/24';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import StarIcon from '@atlaskit/icon/glyph/star';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import Blog24Icon from '@atlaskit/icon-object/glyph/blog/24';

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
      <MenuGroup maxHeight={800}>
        <Section>
          <HeadingItem>Actions</HeadingItem>
          <LinkItem
            elemBefore={<EditorSearchIcon label="Search Icon" />}
            href="#"
          >
            Search your items
          </LinkItem>
          <LinkItem
            elemBefore={<EmojiCustomIcon label="Create Icon" />}
            href="#"
            isDisabled
          >
            Add new item (disabled)
          </LinkItem>
          <LinkItem
            elemBefore={<StarIcon label="Star icon" />}
            elemAfter={<ArrowRightIcon label="" />}
            description="You have 24 starred items."
            href="#"
          >
            Starred items
          </LinkItem>
          <LinkItem
            elemAfter={<ArrowRightIcon label="" />}
            elemBefore={<Archive24Icon label="Quote icon" />}
            description="You have 16 archived items."
          >
            Archived items
          </LinkItem>
        </Section>
        <Section isScrollable hasSeparator>
          <HeadingItem>Favourite articles</HeadingItem>
          <ButtonItem elemBefore={<Blog24Icon label="Quote icon" />}>
            Untitled
          </ButtonItem>
          <ButtonItem
            elemBefore={<Blog24Icon label="Quote icon" />}
            description="It's short and sweet."
          >
            Short stories of Albany
          </ButtonItem>
          <ButtonItem
            elemBefore={<Blog24Icon label="Quote icon" />}
            description="Success often comes with a shadow side and hidden costs. In this article, we examine the shadow side of Pablo Picasso's genius."
          >
            The Shadow Side of Greatness
          </ButtonItem>
          <ButtonItem
            elemBefore={<Blog24Icon label="Quote icon" />}
            description="Self-awareness is critical for success in all fields. Read this article to learn how biologist Louis Agassiz taught self-awareness through observation."
          >
            Famous Biologist Louis Agassiz on the Usefulness of Learning Through
            Observation
          </ButtonItem>
          <ButtonItem
            elemBefore={<Blog24Icon label="Quote icon" />}
            description="Famous poet Joseph Brodsky was exiled from his home in Russia and forced to leave the love of his life behind, never to be seen again. In 1988, Brodsky shared a beautiful strategy and method for dealing with the critics, detractors, and negative influences in your life."
          >
            Joseph Brodsky Explains Perfectly How to Deal With Critics and
            Detractors in Your Life:
          </ButtonItem>
          <ButtonItem
            elemBefore={<Blog24Icon label="Quote icon" />}
            description="Martha Graham, perhaps the most influential dance choreographer of the 20th century, explains why it is not your job to judge your own work"
          >
            Martha Graham on the Hidden Danger of Comparing Yourself to Others
          </ButtonItem>
          <ButtonItem
            elemBefore={<Blog24Icon label="Quote icon" />}
            description="Actress Nichelle Nichols helped shape the Civil Rights Movement without realizing it. Read this article to learn how you can live a meaningful life."
          >
            Lessons on Living a Meaningful Life from Nichelle Nichols
          </ButtonItem>
        </Section>
        <Section hasSeparator>
          <SkeletonHeadingItem />
          <SkeletonItem hasAvatar />
          <SkeletonItem hasAvatar />
          <SkeletonItem hasIcon />
          <SkeletonItem hasIcon width="100%" />
          <SkeletonItem hasIcon width="100%" />
          <SkeletonItem hasIcon />
          <SkeletonItem hasIcon />
        </Section>
      </MenuGroup>
    </div>
  );
};
