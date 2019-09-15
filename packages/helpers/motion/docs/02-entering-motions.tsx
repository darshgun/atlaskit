import React from 'react';
import { md, Props, Example } from '@atlaskit/docs';

export default md`
  ## \`<FadeIn />\`

  Useful for fading in an element.

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-in-single-element').default}
      title="Single element"
      source={require('!!raw-loader!../examples/fade-in-single-element')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/fade-in')}
    />
  )}

  ## \`<StaggeredEntrance />\`

  Useful for staggering an entering animation over multiple elements.

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-in-list-of-elements').default}
      title="List of elements"
      source={require('!!raw-loader!../examples/fade-in-list-of-elements')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-in-grid-of-elements').default}
      title="Grid of elements"
      source={require('!!raw-loader!../examples/fade-in-grid-of-elements')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/staggered-entrance')}
    />
  )}
`;
