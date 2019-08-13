import React from 'react';
import { md, Example, code, Props } from '@atlaskit/docs';
import { AkCode } from '@atlaskit/code';

const attributes =
  '[`React.InputHTMLAttributes<HTMLInputElement>`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L1939)';

export default md`
A \`<input>\` component that supports elements at the start and end of the \`<input>\`

${code`
import Textfield from '@atlaskit/textfield';
`}

\`TextField\` operates in almost the same way as an \`<input>\` element.
Any \`<input>\` compatible props [\`React.InputHTMLAttributes<HTMLInputElement>\`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L1939)
will be passed through to the underlying \`<input>\` element.

For now, there are a few props that we apply directly based on the *public api* of this component.
If you pass through a [\`React.InputHTMLAttributes<HTMLInputElement>\`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L1939) prop that clashes with one of these, it will be overwritten and a warning will be logged.


  ## Examples

  ${(
    <Example
      packageName="@atlaskit/textfield"
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/textfield"
      Component={require('../examples/01-widths').default}
      title="Widths"
      source={require('!!raw-loader!../examples/01-widths')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Textfield')}
    />
  )}
`;
