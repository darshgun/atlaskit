**Editor Bombazine Release**

  **BREAKING CHANGES**

​    **Mobile**

    - Expose ability to cancel default browser behavior when clicking Smart Links

​    **ADF Schema**

    - Remove applicationCard node and action mark
    - Remove exposed `tableBackgroundBorderColors` in favour of `tableBackgroundBorderColor`



  **Affected editor components:**

  Tables, Media, Headings, Copy and Paste, Mobile

  **Anchor Links**

    - Headings in the renderer show an anchor link on hover
      - https://product-fabric.atlassian.net/browse/ED-5137

  **Copy and Paste**

    -Right click for copy image fails the second time that is pasted
      -https://product-fabric.atlassian.net/browse/MS-2324

  **Media**

    -Resizing/Aligning media inside Table 
      -https://product-fabric.atlassian.net/browse/ED-6359
    -Can't insert same file from MediaPicker twice 
      -https://product-fabric.atlassian.net/browse/MS-2080
    -Implement media link in renderer
      -https://product-fabric.atlassian.net/browse/ED-7244

  **Tables**

- Implement Table sorting in renderer - [NEW BIG FEATURE][not enabled]
  - Feature Flag:
    - allowColumnSorting – [default: false]
  - https://product-fabric.atlassian.net/browse/ED-7392
- Expanded table cell background color palette
  - https://product-fabric.atlassian.net/browse/ED-7201

  **Mobile**

    -Provide method for scroll to actions, decisions and mentions
      -https://product-fabric.atlassian.net/browse/FM-2261
      -https://product-fabric.atlassian.net/browse/FM-2055
    -Improve Hybrid Editor Scrolling
      -https://product-fabric.atlassian.net/browse/FM-2212

  **Notable Bug fixes**

    -Can't split merged cell when a cell contain a media item
      -https://product-fabric.atlassian.net/browse/ED-6898
    -Pasting content with an emoji duplicates the emoji as an image
      -https://product-fabric.atlassian.net/browse/ED-7513
    -Content inside of a table cell overflows if table looses focus
      -https://product-fabric.atlassian.net/browse/ED-7529