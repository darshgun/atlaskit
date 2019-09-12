import * as React from 'react';
import {
  md,
  code,
  Props,
  Example,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
  ${<AtlassianInternalWarning />}

  \`\`\`<AtlassianSwitcher />\`\`\` is a React app that can be rendered into a container that will show users:

  * The products they have permission to view and navigate to
  * Their recently viewed containers, if applicable
  * Any cross-flow and admin links, if applicable
  * Any custom links from Jira or Confluence, if applicable

  ## Requirements
  
  In order to integrate the switcher your app requires the following:

  * **AtlassianID integration** - AtlassiaID is required to fetch available products. See implementation details [here](https://hello.atlassian.net/wiki/spaces/PEP/pages/494890457/1.+Sign+Up+Log+In+Anywhere).
  * **Stargate integration** - switcher requires /gateway to be exposed through Stargate in fetch available products. See implementation details [here](https://hello.atlassian.net/wiki/spaces/PEP/pages/494890457/1.+Sign+Up+Log+In+Anywhere).
  
  ## Integrating switcher

  There are multiple ways to integrate switcher within your app. Depending on your application you might need to combine some of the options below.

  * [Atlassian switcher vanilla](/packages/navigation/atlassian-switcher-vanilla) can be used in applications that don't bundle React.
  * [Standalone switcher](/packages/navigation/atlassian-switcher/docs/standalone-switcher) allows to render the siwtcher in any container (e.g. inline dialog) other than the drawer by specifying the appearance property.
  * [Custom themes](/packages/navigation/atlassian-switcher/docs/theming-guide) allow to change the colours and spacing in the switcher component.
  
  ## Basic example

  This is a basic example of the switcher being rendered in a drawer. 

  ${code`import AtlassianSwitcher  from '@atlaskit/atlassian-switcher';`}

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={
        require('../examples/82-uc-generic-switcher-with-xflow').default
      }
      title="Basic switcher example"
      source={require('!!raw-loader!../examples/82-uc-generic-switcher-with-xflow')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/atlassian-switcher')}
      overrides={{
        // @ts-ignore
        features: props => {
          return null;
        },
        // @ts-ignore
        messages: props => {
          return null;
        },
        // @ts-ignore
        product: props => {
          return null;
        },
      }}
    />
  )}
`;
