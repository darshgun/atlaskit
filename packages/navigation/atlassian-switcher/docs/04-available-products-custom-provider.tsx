import { md, code } from '@atlaskit/docs';

export default md`

  The list of available products used to build the switcher is usually fetched from an endpoint
  relative to the product. When there is need to use a different endpoint, the switcher accepts a
  custom provider through the optional prop \`availableProductsDataProvider\`.


  ### Creating a custom provider

  ${code`
import { createAvailableProductsProvider } from '@atlaskit/atlassian-switcher/create-custom-provider';

const customAvailableProductsDataProvider = createAvailableProductsProvider(
  'https://api-private.atlassian.com/worklens/api/available-products'
);
  `}

  ### Passing the custom provider to the switcher

  ${code`
<AtlassianSwitcher
  product="bitbucket"
  enableUserCentricProducts
  availableProductsDataProvider={customAvailableProductsDataProvider}
  disableCustomLinks
  disableRecentContainers
  disableHeadings
/>
  `}

  *Note that the custom provider only works if \`enableUserCentricProducts\` is \`true\`*

  ### Passing the custom provider to the prefetch trigger

  ${code`
  <AtlassianSwitcherPrefetchTrigger
    enableUserCentricProducts
    availableProductsDataProvider={customAvailableProductsDataProvider}
  >
    <Button type="button" onClick={this.openDrawer}>
      Open drawer
    </Button>
  </AtlassianSwitcherPrefetchTrigger>
  `}

  *Note that the custom provider only works if \`enableUserCentricProducts\` is \`true\`*
  `;
