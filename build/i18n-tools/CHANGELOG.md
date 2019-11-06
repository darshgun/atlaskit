# @atlaskit/i18n-tools

## 0.6.1

### Patch Changes

- [patch][f081cdac54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f081cdac54):

  Upgrade prettier from 1.14 to 1.18

## 0.6.0

### Minor Changes

- [minor][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of "mediaClientConfig". This affects all public media UI components.
  - https://product-fabric.atlassian.net/browse/MS-2038
- **Tasks & Decisions:** Removed containerAri for task-decisions components.
  - https://product-fabric.atlassian.net/browse/ED-7631
- **Renderer:** Adapts to task-decision changes.
- **Editor Mobile Bridge:** Adapts to task-decision changes.
- **Util Data Test:** Adapts to task-decision changes.

---

**Affected Editor Components:**

tables, media, mobile, emoji, tasks & decisions, analytics

**Editor**

- Support nested actions in stage-0 schema; Change DOM representation of actions
  - https://product-fabric.atlassian.net/browse/ED-7674
- Updated i18n translations
  - https://product-fabric.atlassian.net/browse/ED-7750
- Improved analytics & crash reporting (via a new error boundary)
  - https://product-fabric.atlassian.net/browse/ED-7766
  - https://product-fabric.atlassian.net/browse/ED-7806
- Improvements to heading anchor links.
  - https://product-fabric.atlassian.net/browse/ED-7849
  - https://product-fabric.atlassian.net/browse/ED-7860
- Copy/Paste improvements
  - https://product-fabric.atlassian.net/browse/ED-7840
  - https://product-fabric.atlassian.net/browse/ED-7849
- Fixes for the selection state of Smart links.
  - https://product-fabric.atlassian.net/browse/ED-7602?src=confmacro
- Improvements for table resizing & column creation.
  - https://product-fabric.atlassian.net/browse/ED-7698
  - https://product-fabric.atlassian.net/browse/ED-7319
  - https://product-fabric.atlassian.net/browse/ED-7799

**Mobile**

- GASv3 Analytics Events are now relayed from the web to the native context, ready for dispatching.
  - https://product-fabric.atlassian.net/browse/FM-2502
- Hybrid Renderer Recycler view now handles invalid ADF nodes gracefully.
  - https://product-fabric.atlassian.net/browse/FM-2370

**Media**

- Improved analytics
  - https://product-fabric.atlassian.net/browse/MS-2036
  - https://product-fabric.atlassian.net/browse/MS-2145
  - https://product-fabric.atlassian.net/browse/MS-2416
  - https://product-fabric.atlassian.net/browse/MS-2487
- Added shouldOpenMediaViewer property to renderer
  - https://product-fabric.atlassian.net/browse/MS-2393
- Implemented analytics for file copy
  - https://product-fabric.atlassian.net/browse/MS-2036
- New `media-viewed` event dispatched when media is interacted with via the media card or viewer.
  - https://product-fabric.atlassian.net/browse/MS-2284
- Support for `alt` text attribute on media image elements.
  - https://product-fabric.atlassian.net/browse/ED-7776

**i18n-tools**

Bumped dependencies.

## 0.5.3

### Patch Changes

- [patch][375ebefdb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/375ebefdb9):

  Adding Smartlings to i18n tools.

## 0.5.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.5.1

### Patch Changes

- [patch][b23479c7ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b23479c7ba):

  fix i18n-tools validation error on try/catch

## 0.5.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.4.0

- [minor][941a687](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/941a687):

  Extract TypeScript based React Component translations without building it first

  **New features**

  - Support for extracting from TypeScript files (`.ts`, `.tsx`).
  - A new `--ignore` flag for `push` command. It takes a list of comma separated globs. Default value is `"**/__tests__/**"`.

    Usage:

    ```
    i18n-tools pull --ignore "**/__tests__/**,**/__fixtures__/**"  packages/core/xyz
    ```

  **Breaking**

  - `--outputType` has been renamed to `--type` and now both `push` & `pull` commands accept it.
  - `--searchDir` default value has been changed from `dist/es2015` to `src`.

## 0.3.1

- [patch] Add translations for help-dialog and colors [42a2916](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a2916)

## 0.3.0

- [minor] ED-5150 Editor i18n: Main toolbar [ef76f1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef76f1f)

## 0.2.0

- [minor] Add pull support [d27b63b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d27b63b)

## 0.1.1

- [patch] Initial release [7d0f35d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d0f35d)
