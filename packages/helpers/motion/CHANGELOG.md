# @atlaskit/motion

## 0.1.1

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  New `<ExitingPersistence />` component

  You can now persist exiting elements using `ExitingPersistence`.
  Doing so will allow them to animate away while exiting.

  There are three ways you can utilise this component:

  **Conditionally rendering a single component**

  ```
  import { FadeIn, ExitingPersistence } from '@atlaskit/motion';

  ({ entered }) => (
    <div>
      <ExitingPersistence>
        {entered && (
          <FadeIn>{props => <div {...props}>hello world</div>}</FadeIn>
        )}
      </ExitingPersistence>
    </div>
  );
  ```

  **Conditionally rendering multiple components**

  ```
  import { FadeIn, ExitingPersistence } from '@atlaskit/motion';

  () => (
    <ExitingPersistence>
      {one && <FadeIn>{props => <div {...props}>hello world</div>}</FadeIn>}
      {two && <FadeIn>{props => <div {...props}>hello world</div>}</FadeIn>}
    </ExitingPersistence>
  );
  ```

  **Conditionally rendering elements in an array**

  Make sure to have unique keys for every element!

  ```
  import { FadeIn, ExitingPersistence } from '@atlaskit/motion';

  () => (
    <ExitingPersistence>
      {elements.map(element => (
        // Key is very important here!
        <FadeIn key={element.key}>
          {props => <div {...props}>hello world</div>}
        </FadeIn>
      ))}
    </ExitingPersistence>
  );
  ```

  Updated `<StaggeredEntrance />` component

  `StaggeredEntrance` no longer has the limitation of requiring motions to be the direct descendant.
  Simply ensure your motion elements are somewhere in the child tree and they will have their entrance motion staggered.

  ```
  import { FadeIn, StaggeredEntrance } from '@atlaskit/motion';

  () => (
    <StaggeredEntrance>
      <div>
        {items.map(logo => (
          <div key={logo.key}>
            <FadeIn>{props => <div {...props} />}</FadeIn>
          </div>
        ))}
      </div>
    </StaggeredEntrance>
  );
  ```

## 0.1.0

### Minor Changes

- [minor][5c3fc52da7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c3fc52da7):

  The internal `Motion` component is now called `KeyframesMotion`.- [minor][1dd6a6d6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1dd6a6d6ac):

  `ExitingPersistence` now has an `appear` prop.
  Previously entering motions would always appear when mounting - now you have to opt into the behaviour.

  ```diff
  -<ExitingPersistence>
  +<ExitingPersistence appear>
    ...
  </ExitingPersistence>
  ```

### Patch Changes

- [patch][f175c8088f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f175c8088f):

  Fixes non-exiting elements from re-rendering unnecessarily.

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
