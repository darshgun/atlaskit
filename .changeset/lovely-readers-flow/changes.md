  `@atlaskit/checkbox` **10.x** includes the following changes: 
  * Replaced previous theme implementation with new `@atlaskit/theme` v2 implementation 
    * Please read more about this implementation in the [theming guide](https://atlaskit.atlassian.com/packages/core/theme/docs/theming-guide)
  * Added `overrides` prop which enables targeted customisations of key components in the @atlaskit/checkbox package. 
    * Please read more about this implementation in the [overrides guide](https://atlaskit.atlassian.com/packages/core/theme/docs/overrides-guide)

  ### Breaking Changes
  **HiddenCheckbox and spread props**

  Passing props to the `<Checkbox/>` component for them to be spread onto the underlying `<HiddenCheckbox/>` component is now **no longer possible**. 
  `@atlaskit/checkbox` still supports passing props down to the `<HiddenCheckbox/>` component, however we've opted to make this behaviour more explicit.
  
  Whereas previously you would do this: 
  ```js
  <Checkbox 
    ...supportedCheckboxProps
    'data-testid'='test-checkbox' 
  />
  ```

  Now you would leverage the overrides prop to pass these props down to the `<HiddenCheckbox/>` component like so:
  ```js
  <Checkbox
    ...supportedCheckboxProps
    overrides={{
      HiddenCheckbox:{
        attributesFn: () => ({ 'data-testid': 'test-checkbox' })
      }
    }}
  />
  ```