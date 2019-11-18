# @atlaskit/atlassian-navigation

## 0.6.4

### Patch Changes

- [patch][1ef7f6bba9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ef7f6bba9):

  Fixed nav height

## 0.6.3

### Patch Changes

- [patch][8e8366be2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e8366be2c):

      Update IconButton types from string to React.ReactNode.

## 0.6.2

### Patch Changes

- [patch][02d05ff668](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02d05ff668):

  - Fix types for the tooltip prop to allow React components.
  - Introduce `buttonTooltip` and `iconButtonTooltip` to configure tooltip for create button.

## 0.6.1

### Patch Changes

- [patch][042a5d87ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/042a5d87ea):

  Reduced unnecessary deps for navigation, and added temp \_itemTheme export to style dropdown-menu items

## 0.6.0

### Minor Changes

- [minor][355e7ca2ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/355e7ca2ea):

  Breaking changes from previous version:

  - Rename siteName to siteTitle to match what it is called in the products
  - Rename isSelected prop to isHighlighted to avoid confusion with the CSS states of the button, which is also exposed as a prop to Button

  Other visual changes:

  - Primary buttons in the nav with dropdowns stay highlighted when the drop down is open.
  - Fix active state in FF
  - Gradients for Atlassian products works correctly

## 0.5.1

### Patch Changes

- [patch][5eb3d1fc75](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5eb3d1fc75):

  Removed spinner from the notifications package (handled by the iframe content instead)

## 0.5.0

### Minor Changes

- [minor][48640192dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48640192dc):

  Adds support for white nav. Repositions how the components are displayed. Changes to the theming API to support white nav. Add support for showing site name

## 0.4.9

- Updated dependencies [6e0bcc75ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e0bcc75ac):
  - @atlaskit/popup@0.2.0

## 0.4.8

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 0.4.7

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 0.4.6

### Patch Changes

- [patch][fcfd4db9c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fcfd4db9c0):

  Fixing focus styles for IconButtons

## 0.4.5

### Patch Changes

- [patch][fda9024074](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fda9024074):

  Add a fully instrumented example of atlassian-navigation using @atlaskit/analytics-next

## 0.4.4

### Patch Changes

- [patch][c24724add6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c24724add6):

  Update entry points and exports

## 0.4.3

### Patch Changes

- [patch][6a82fd06ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a82fd06ab):

  Render tooltip only when supplied, and fix button focus background color

## 0.4.2

### Patch Changes

- [patch][c810632671](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c810632671):

  Update theme generation

## 0.4.1

### Patch Changes

- [patch][f7eb0a4886](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7eb0a4886):

  Ensuring new horizontal nav allows for scrollbar width. Using 'vw' units prevents this.

## 0.4.0

### Minor Changes

- [minor][c5939cb73d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5939cb73d):

  Integrate popup component

## 0.3.2

### Patch Changes

- [patch][9a59c6e93b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a59c6e93b):

  Fix badge and primary items container styles

## 0.3.1

### Patch Changes

- [patch][197aa4ed2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/197aa4ed2c):

  Use context hooks in favour of emotion-theming

## 0.3.0

### Minor Changes

- [minor][382273ee49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/382273ee49):

  Add more behaviour

## 0.2.2

### Patch Changes

- [patch][13f8980fb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13f8980fb2):

  Use emotion object style

## 0.2.1

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/drawer@5.0.10
  - @atlaskit/dropdown-menu@8.1.1
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 0.2.0

### Minor Changes

- [minor][187b3147bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/187b3147bd):

  Add theming support

## 0.1.3

- Updated dependencies [6410edd029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6410edd029):
  - @atlaskit/badge@13.0.0
  - @atlaskit/notification-indicator@7.0.8

## 0.1.2

### Patch Changes

- [patch][8e692b02f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e692b02f5):

  Add `AppNavigationSkeleton` as a named export.

## 0.1.1

### Patch Changes

- [patch][f0980913df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0980913df):

  Add missing dependencies to package.json
