import * as React from 'react';
import { md, code, Example } from '@atlaskit/docs';

export default md`

  To implement the switcher in any container other than the drawer, specify the appearance property to be standalone.
 
  ${code`import AtlassianSwitcher  from '@atlaskit/atlassian-switcher';`}

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/01-standalone').default}
      title="Standalone switcher example"
      source={require('!!raw-loader!../examples/01-standalone')}
    />
  )}
  `;
