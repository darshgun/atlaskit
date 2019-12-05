# @atlaskit/motion

## 0.0.4

### Patch Changes

- [patch][f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):

  Corrects the type exports for typography, colors, elevation and layers. If you were doing any dynamic code it may break you. Refer to the [upgrade guide](/packages/core/theme/docs/upgrade-guide) for help upgrading.- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):

- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/theme@9.3.0

## 0.0.3

### Patch Changes

- [patch][94abe7f41a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94abe7f41a):

  New `useResizingHeight()` hook

  This is a small yet powerful hook which you can consume to enable an element to resize its `height` when it changes after a state transition.
  It uses CSS under-the-hood to maximize performance.

  ```
  import { useResizingHeight } from '@atlaskit/motion';

  ({ text }) => <div {...useResizingHeight()}>{text}</div>;
  ```

## 0.0.2

### Patch Changes

- [patch][d8a99823e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8a99823e2):

  Adds FadeIn and StaggeredEntrance components and reduced motion utilities.

## 0.0.1

### Patch Changes

- [patch][cdcb428642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdcb428642):

  Initial release of @atlaskit/motion
