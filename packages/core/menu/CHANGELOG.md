# @atlaskit/menu

## 0.2.0

### Minor Changes

- [minor][795a9503da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/795a9503da):

  Menu has had few styling fixes:

  - **BREAKING:** Height for all `Item` components when there is no `description` defined now equals `40px`.
  - **BREAKING:** `SkeletonHeadingItem` & `SkeletonItem` now match the real components dimensions,
    this means they will no longer move things around when swapping them in & out.
  - `SkeletonHeadingItem` has had its width slightly increased.
  - `Skeleton` items now have a shimmer effect that you can opt into with the `isShimmering` prop.
  - `HeadingItem` now has the correct `font-weight`.
  - `Item` components `description` now has the correct `font-size`.

### Patch Changes

- [patch][b7b0ead295](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7b0ead295):

  Adds `testId` to all components - useful when wanting to do any automated tests that want to target these specific elements.- Updated dependencies [429925f854](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/429925f854):

  - @atlaskit/theme@9.4.0

## 0.1.3

### Patch Changes

- [patch][9af7977678](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9af7977678):

  Fixing visual tweaks for top nav and menu spacing

## 0.1.2

### Patch Changes

- [patch][3b785fa323](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b785fa323):

  Various UI fixes

## 0.1.1

### Patch Changes

- [patch][ac6ba9b837](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac6ba9b837):

  Fix bug where Skeleton width wasn't being picked up. Allow skeleton heading width to be configurable to make API consistent with skeleton item

## 0.1.0

### Minor Changes

- [minor][d85f0206b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d85f0206b0):

  added isSelected prop to Items

## 0.0.2

### Patch Changes

- [patch][eaca633b3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eaca633b3d):

  Style ItemSkeletons and ItemHeadings. Add the ability to add icon or avatar and configure skeleton width.

## 0.0.1

### Patch Changes

- [patch][ba4eed96dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba4eed96dc):

  Create Menu package and expose `Item` and `LinkItem` components
