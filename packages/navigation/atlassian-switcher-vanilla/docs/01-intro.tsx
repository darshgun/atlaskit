import { md, code } from '@atlaskit/docs';

export default md`
  Use this wrapper if you need to consume the Atlassian Switcher on a non react app.

  ## Usage:
  ${code`
import prepareSwitcher from '@atlaskit/atlassian-switcher-vanilla';

// initialize the switcher
const switcher = prepareSwitcher({
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

  ## Switcher props

  For the complete documentation on Atlassian Switcher, head to [Atlassian Switcher](/packages/navigation/atlassian-switcher)
`;
