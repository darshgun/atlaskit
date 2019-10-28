Adds `highlight` prop to `AkCodeBlock`, `Example`, and the `code` template literal.
Use this to emphasize which lines of code you would like people to look at!

The `highlight` prop can be used as follows:

- To highlight one line:
  `highlight="3"`
- To highlight sequential lines:
  `highlight="1-5"`
- To highlight sequential and multiple single lines:
  `highlight="1-5,7,10,15-20"`

## `AkCodeBlock` component

Use the `highlight` prop.

```js
import { AkCodeBlock } from '@atlaskit/code';

<AkCodeBlock
  highlight="1-2"
  text={`
<div>
  hello there
  <span>buds</span>
</div>
  `}
/>;
```

## `Example` component

Use the `highlight` prop.

```js
import { Example } from '@atlaskit/docs';

<Example
  packageName="@atlaskit/code"
  Component={require('../examples/00-inline-code-basic').default}
  title="Basic"
  highlight="19,24,30,36"
  source={require('!!raw-loader!../examples/00-inline-code-basic')}
/>;
```

## `code` template literal

Add `highlight=` to the top of your code snippet.
It takes the same values as the `highlight` prop.

```js
import { code } from '@atlaskit/docs';

code`highlight=5-7
  import React from 'react';

  () => (
    <div>
      hello there
      <span>buds</span>
    </div>
)`;
```
