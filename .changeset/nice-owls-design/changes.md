## New `useResizingHeight()` hook

This is a small yet powerful hook which you can consume to enable an element to resize its `height` when it changes after a state transition.
It uses CSS under-the-hood to maximize performance.

```js
import { useResizingHeight } from '@atlaskit/motion';

({ text }) => <div {...useResizingHeight()}>{text}</div>;
```
