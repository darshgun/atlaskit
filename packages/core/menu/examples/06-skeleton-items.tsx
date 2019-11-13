import React from 'react';
import { MenuGroup, Section, SkeletonItem, SkeletonHeadingItem } from '../src';

export default () => {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <div
        style={{
          width: '200px',
          border: '1px solid #EFEFEF',
          margin: '10px auto',
          borderRadius: '4px',
        }}
      >
        <MenuGroup maxHeight={300}>
          <Section>
            <SkeletonHeadingItem />
            <SkeletonItem hasAvatar />
            <SkeletonItem hasAvatar />
            <SkeletonItem hasAvatar />
            <SkeletonItem hasAvatar />
            <SkeletonItem hasAvatar />
            <SkeletonItem hasAvatar />
            <SkeletonItem hasAvatar />
          </Section>
          <Section hasSeparator>
            <SkeletonHeadingItem />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
          </Section>
        </MenuGroup>
      </div>
      <div
        style={{
          width: '200px',
          border: '1px solid #EFEFEF',
          margin: '10px auto',
          borderRadius: '4px',
        }}
      >
        <MenuGroup maxHeight={300}>
          <Section>
            <SkeletonItem />
          </Section>
          <Section isScrollable hasSeparator>
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
            <SkeletonItem hasIcon />
          </Section>
          <Section hasSeparator>
            <SkeletonItem />
            <SkeletonItem />
          </Section>
        </MenuGroup>
      </div>
    </div>
  );
};
