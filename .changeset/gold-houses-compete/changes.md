**Editor Bombazine Release**

  **BREAKING CHANGES**

​    **Renderer**

    - Change in contract for `eventHandlers.smartCard.onClick` prop:
        Old: onClick(url): void
        New: onClick(event, url): void 

​    **ADF Schema**

    - Remove applicationCard node and action mark
    - Remove exposed `tableBackgroundBorderColors` in favour of `tableBackgroundBorderColor`



  **Affected editor components:**

  Tables, Media, Headings, Copy and Paste, Mobile

  **Anchor Links**

    - Headings in the renderer now show an anchor link on hover
      - Feature Flag:
        - allowHeadingAnchorLinks - [default: false]
      - https://product-fabric.atlassian.net/browse/ED-5137

  **Copy and Paste**

    - Fixed a bug where right click for copy image failed the second time that is pasted
      - https://product-fabric.atlassian.net/browse/MS-2324

  **Media**

    - Resizing/Aligning media inside Table 
      - Feature Flag:
        - allowResizingInTables - [default: false]
      - https://product-fabric.atlassian.net/browse/ED-6359
    - You can now insert same file from MediaPicker twice 
      - https://product-fabric.atlassian.net/browse/MS-2080
    - Implement media link in renderer
      - https://product-fabric.atlassian.net/browse/ED-7244

  **Tables**

    - Implement table sorting in renderer - [NEW BIG FEATURE][not enabled]
      - Feature Flag:
        - allowColumnSorting – [default: false]
      - https://product-fabric.atlassian.net/browse/ED-7392
    - Expanded table cell background color palette
      - https://product-fabric.atlassian.net/browse/ED-7201

  **Mobile**

    - Provide method for scrolling to actions, decisions and mentions
      - https://product-fabric.atlassian.net/browse/FM-2261
      - https://product-fabric.atlassian.net/browse/FM-2055
    - Improve Hybrid Editor Scrolling
      - https://product-fabric.atlassian.net/browse/FM-2212

  **Notable Bug fixes**

    - Fixed an issue where you couldn't split merged cells when a cell contained a media item
      - https://product-fabric.atlassian.net/browse/ED-6898
    - Pasting content with an emoji no longer duplicates the emoji as an image
      - https://product-fabric.atlassian.net/browse/ED-7513
    - Content inside of a table cell no longer overflows if table looses focus
      - https://product-fabric.atlassian.net/browse/ED-7529
    - Fixed an issue when adding rows and cols at the same time start adding infinite columns
      - https://product-fabric.atlassian.net/browse/ED-7700