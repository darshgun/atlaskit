import React from 'react';
import { md, Props, Example } from '@atlaskit/docs';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';

const exitMotionEnabled = (
  <Tooltip
    content="This motion has a pairing exit motion"
    position="mouse"
    tag="span"
    delay={50}
  >
    <Lozenge appearance="new">Has exit</Lozenge>
  </Tooltip>
);

const staggeredEntranceEnabled = (
  <Tooltip
    content="This motion can be staggered across multiple elements"
    position="mouse"
    tag="span"
    delay={50}
  >
    <Lozenge appearance="inprogress">Can stagger</Lozenge>
  </Tooltip>
);

export default md`
  ## \`<FadeIn />\`

  ${exitMotionEnabled}

  ${' '}

  ${staggeredEntranceEnabled}

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-out-single-element').default}
      title="Single element"
      source={require('!!raw-loader!../examples/fade-out-single-element')}
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

  ${(
    <p>
      Some entering motions can be staggered over multiple elements, look for
      the {staggeredEntranceEnabled} label. To enable staggered entering motions
      import this component and wrap the entering motions with it.
    </p>
  )}

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

  ## \`<ExitingPersistence />\`

  ${(
    <p>
      Some entering motions have a pairing exit motion, look for the{' '}
      {exitMotionEnabled} label. To enable exit motions import this component
      and wrap the entering motions with it.
    </p>
  )}

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-between-elements').default}
      title="Single element"
      source={require('!!raw-loader!../examples/fade-between-elements')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-out-list-of-elements').default}
      title="List of elements"
      source={require('!!raw-loader!../examples/fade-out-list-of-elements')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/exiting-persistence')}
    />
  )}
`;
