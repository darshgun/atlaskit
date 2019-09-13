import React from 'react';
import { md, code, DevPreviewWarning, Props, Example } from '@atlaskit/docs';

export default md`
  ${<DevPreviewWarning />}

  ## Components

  ### FadeIn

  Useful for fading in an element.

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-in-single-element').default}
      title="Single element"
      source={require('!!raw-loader!../examples/fade-in-single-element')}
    />
  )}

  #### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entrance/fade-in')}
    />
  )}

  ### StaggeredEntrance

  Useful for staggering an entrance animation over multiple elements.

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

  #### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entrance/staggered-entrance')}
    />
  )}

  ## Prefers Reduced Motion

  Atlaskit Motion comes with reduced motion support out of the box.
  Want to check them yourself in your own app? Too easy.

  [Unsure what reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) is?
  It enables users to essentially tell websites "hey, I don't actually want animation tbh".
  However it's up to us - the developers - to ensure they get their wish.

  ### isReducedMotion()

  Useful when performing animation at runtime and you need to check just in time.

  <br />

  ${code`
import { isReducedMotion } from '@atlaskit/motion';

if (!isReducedMotion()) {
  // do the motion
}
  `}

  ### reduceMotionCheck()

  Useful when performing animation or transitions with just CSS.

  <br />

  ${code`
import { reduceMotionCheck } from '@atlaskit/motion';

// @emotion/core css prop
<div
  css={{
    animationName: 'slide-in',
    ...reduceMotionCheck()
  }}
/>

// styled-components template literal
styled.div\`
  animation-name: slide-in;
  \$\{reduceMotionCheck()};
\`;

// styled-components object
styled.div({
  animationName: 'slide-in',
  ...reduceMotionCheck()
});
    `}
`;
