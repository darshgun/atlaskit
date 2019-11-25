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
            <SkeletonHeadingItem width="50%" />
            <SkeletonItem hasAvatar width="45%" />
            <SkeletonItem hasAvatar width="45%" />
            <SkeletonItem hasAvatar width="45%" />
            <SkeletonItem hasAvatar width="45%" />
            <SkeletonItem hasAvatar width="45%" />
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
