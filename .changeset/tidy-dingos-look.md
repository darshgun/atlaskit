---
'@atlaskit/menu': minor
---

Menu has had few styling fixes:

- **BREAKING:** Height for all `Item` components when there is no `description` defined now equals `40px`.
- **BREAKING:** `SkeletonHeadingItem` & `SkeletonItem` now match the real components dimensions,
  this means they will no longer move things around when swapping them in & out.
- `SkeletonHeadingItem` has had its width slightly increased.
- `Skeleton` items now have a shimmer effect that you can opt into with the `isShimmering` prop.
- `HeadingItem` now has the correct `font-weight`.
- `Item` components `description` now has the correct `font-size`.
