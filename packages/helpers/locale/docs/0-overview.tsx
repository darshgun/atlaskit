import React from 'react';
import { md, Example, code } from '@atlaskit/docs';

export default md`
  Use .

  ## Usage

  ${code`
import { createLocalizationProvider, } from '@atlaskit/locale'; 

const localizationProvider = createLocalizationProvider('ja-JP');
`}

  ${(
    <Example
      packageName="@atlaskit/locale"
      Component={require('../examples/0-overview').default}
      title="Overview"
      source={require('!!raw-loader!../examples/0-overview')}
    />
  )}
`;
