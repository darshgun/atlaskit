import * as React from 'react';
import { md, code, Props } from '@atlaskit/docs';
import { peerDependencies } from '../package.json';

const packagesWithVersionsArr = Object.entries(peerDependencies).map(
  ([packageName, version]) => `${packageName}@${version}`,
);
const packagesWithVersionsList = packagesWithVersionsArr.join('\n');
const packagesWithVersionsStr = packagesWithVersionsArr.join(' ');

export default md`
  The Switcher was built using React but we know that not everyone is using React on their products. We expose a set of helpers to make consumption easier if this is your case.

  ## Usage:
  ${code`
import prepareSwitcher from '@atlaskit/atlassian-switcher/vanilla-wrapper';

// initialize the switcher
const switcher = this.prepareSwitcher({
  product: 'opsgenie',
  disableCustomLinks: true,
  disableRecentContainers: true,
  disableHeadings: true,
  enableUserCentricProducts: true,
  cloudId: 'some-cloud-id',
  appearance: 'standalone',
},
(event, channel) => {
  console.log(
      channel,
      event.payload,
      event.context,
  )
});

// prefetch bundles and api calls
switcher.prefetch();

// get a reference to the element where the switcher will be rendered
const container = document.getElementById('switcher-container');

// render the switcher when you are ready.
// save the returned value so you can destroy it later.
const destroy = switcher.renderAt(container);

// destroy it so event handlers and other resources associated
// with the switcher can be cleaned up.
destroy();
  `}

  ## Peer Dependencies
  The switcher was built in React and lists some of its depependecies as peer dependencies, which means that the consumer should provide them.

  Your project might already have some of the dependencies installed, please just ensure that they match the dependency versions as listed below, otherwise, the switcher might not work as expected.

  ${code`${packagesWithVersionsList}`}

  To install all of them run one of the following commands:

  ##### Npm users:

  ${code`npm install ${packagesWithVersionsStr} --save`}

  ##### Yarn users:

  ${code`yarn add ${packagesWithVersionsStr}`}

  ## Importing
  The vanilla wrapper lives in its own entry point inside the package to avoid polluting the main bundle. It can be accessed using:

  ${code`import prepareSwitcher from '@atlaskit/atlassian-switcher/vanilla-wrapper';`}

  ## API details

  #### \`prepareSwitcher(switcherProps, analyticsListener)\`
  Main method, used to prepare the switcher before usage. It takes 2 arguments:
  - \`switcherProps\` takes the props that will be passed down to the switcher;
  - \`analyticsListener\` takes a function that will handle analytics;

  The return value of this method will include 2 other methods:
  - \`prefetch()\` - to prefetch bundles and api calls so when you open the switcher, everything is there already.
  We recommend to call this method when the user hovers the trigger to open the switcher. This method only runs once, subsequent calls will do nothing.

  - \`renderAt(container)\` - render the switcher on the container specified. The container should be already in the page.
  This method will return a function that should be called when you want to destroy the switcher;

  ${(
    <Props
      heading="switcherProps"
      props={require('!!extract-react-types-loader!../src/components/switcher')}
    />
  )}
`;
