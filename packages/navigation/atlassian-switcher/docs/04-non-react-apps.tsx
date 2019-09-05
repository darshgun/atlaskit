import * as React from 'react';
import { md, code, Props } from '@atlaskit/docs';

export default md`
  We expose a set of helpers to allow usage of the switcher on non react applications (i.e: backbone, angular, jquery);

  ## Usage:
  ${code`
import prepareSwitcher from '@atlaskit/atlassian-switcher/non-react-apps';

// bootstrap the switcher
const switcher = this.prepareSwitcher();

// prefetch bundles and api calls
switcher.prefetch();

// get a reference to the element where the switcher will be rendered
const container = document.getElementById('switcher-container');

// render the switcher when you are ready.
// save the returned value so you can destroy it later.
this.destroy = switcher.renderAt(container);

// destroy it so event handlers and other resources associated
// with the switcher can be cleaned up.
this.destroy();
  `}

  ## Importing
  Instead of importing from the root of the package, the helpers for non react apps are only available directly through a sub entry point.
  We use this approach to avoid polluting the main bundle.

  ${code`import prepareSwitcher from '@atlaskit/atlassian-switcher/non-react-apps';`}

  ## API details

  #### \`prepareSwitcher(switcherProps, analyticsListener)\`
  Main method, used to prepare the switcher before usage. It takes 2 arguments:
  - \`switcherProps\` takes the props that will be passed down to the switcher;
  - \`analyticsListener\` takes a function that will handle analytics;

  The return value of this method will include 2 other methods:
  - \`prefetch()\` - to prefetch bundles and api calls so when you open the switcher, everything is there already.
  We recommend to call this method when the user hovers the trigger to open the switcher.

  - \`renderAt(container)\` - render the switcher on the container specified. The container should be already in the page.
  This method will return a function that should be called when you want to destroy the switcher;

  ${(
    <Props
      heading="switcherProps"
      props={require('!!extract-react-types-loader!../src/components/switcher')}
    />
  )}
`;
