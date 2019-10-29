## New `<ExitingPersistence />` component

You can now persist exiting elements using `ExitingPersistence`.
Doing so will allow them to animate away while exiting.

There are three ways you can utilise this component:

1. Conditionally rendering a single component

```js
import { FadeIn, ExitingPersistence } from '@atlaskit/motion';

({ entered }) => (
  <div>
    <ExitingPersistence>
      {entered && <FadeIn>{props => <div {...props}>hello world</div>}</FadeIn>}
    </ExitingPersistence>
  </div>
);
```

2. Conditionally rendering multiple components

```js
import { FadeIn, ExitingPersistence } from '@atlaskit/motion';

() => (
  <ExitingPersistence>
    {one && <FadeIn>{props => <div {...props}>hello world</div>}</FadeIn>}
    {two && <FadeIn>{props => <div {...props}>hello world</div>}</FadeIn>}
  </ExitingPersistence>
);
```

3. Conditionally rendering elements in an array (make sure to have unique keys for every element!)

```js
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

## Updated `<StaggeredEntrance />` component

`StaggeredEntrance` no longer has the limitation of requiring motions to be the direct descendant.
Simply ensure your motion elements are somewhere in the child tree and they will have their entrance motion staggered.

```js
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
