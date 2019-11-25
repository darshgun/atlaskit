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
