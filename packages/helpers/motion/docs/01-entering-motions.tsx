import React from 'react';
import { md, Props, Example, code } from '@atlaskit/docs';

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

  ### Gotchas

  The direct descendant children need to be an entering component, such as \`<FadeIn />\`.
  Because of this if you use a custom component make sure to pass the overflow props to it:

  ${code`
const ListItem = ({ id, ...props }) => (
  <FadeIn {...props}>{motion => <div {...motion} />}</FadeIn>
);

const List = () => (
  <StaggeredEntrance>
    <ListItem />
    <ListItem />
    <ListItem />
  </StaggeredEntrance>
)
  `}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/staggered-entrance')}
    />
  )}
`;
