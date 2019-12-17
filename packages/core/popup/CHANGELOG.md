# @atlaskit/popup

## 0.2.5

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/radio@3.1.5
  - @atlaskit/popper@3.1.8

## 0.2.4

### Patch Changes

- [patch][d0415ae306](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0415ae306):

  Popup now uses the correct e200 shadow

## 0.2.3

### Patch Changes

- [patch][542080be8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/542080be8a):

  Bumped react-popper and resolved infinite looping refs issue, and fixed close-on-outside-click for @atlaskit/popup- [patch][995c1f6fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/995c1f6fd6):

  Popup close on outside click no longer fires when clicking on content within the popup that re-renders

## 0.2.2

### Patch Changes

- [patch][3cad6b0118](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cad6b0118):

  Exposed offset prop for popper allowing positioning of popups relative to the trigger. Added example for double pop-up pattern

## 0.2.1

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 0.2.0

### Minor Changes

- [minor][6e0bcc75ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e0bcc75ac):

  - Adds the ability to render class components as children of Popup.
  - Removes redundatnt onOpen callback prop for Popup

## 0.1.5

### Patch Changes

- [patch][93fe1d6f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93fe1d6f0d):

  Fix issue where popup content is rendered infinitely

## 0.1.4

### Patch Changes

- [patch][c0a6abed47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0a6abed47):

  Add onOpen and re-render unit tests

## 0.1.3

### Patch Changes

- [patch][28e9c65acd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28e9c65acd):

  - Add multiple popups example
  - Add unit tests
  - Add useCloseManager
  - Fix bug that did not call onClose on open popups
  - Move RepositionOnUpdate to a separate file
  - Remove scroll lock and corresponding example
  - Remove requestAnimationFrame usage
  - Replace @emotion/styled with @emotion/core

## 0.1.2

### Patch Changes

- [patch][242dd7a06d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/242dd7a06d):

  Expose additional types

## 0.1.1

### Patch Changes

- [patch][583a9873ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583a9873ef):

  Provided better description for popup types

## 0.1.0

### Minor Changes

- [minor][f1a3548732](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a3548732):

  Introduce new package for the lightweight inline-dialog to be used in @atlaskit/app-navigation. The package will stay internal for now until more hardening is done, but releasing first minor to unblock navigation work.
