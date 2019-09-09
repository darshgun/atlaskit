import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  ### Popup
  A Component that is used to trigger a pop-over container inside a React Portal.

  ## Usage

  ${code`
  import Popup from '@atlaskit/popup';
  `}

  ${(
    <Example
      packageName="@atlaskit/popup"
      Component={require('../examples/10-popup').default}
      title="Popup"
      source={require('!!raw-loader!../examples/10-popup')}
    />
  )}

  ${(
    <Props
      heading="Popup Props"
      props={require('!!extract-react-types-loader!../src/index')}
    />
  )}

`;
