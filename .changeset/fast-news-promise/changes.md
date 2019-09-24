**FABDODGEM-12 Editor Cashmere Release**

**Affected editor components:**

tables, media, mobile, text color, emoji, copy/paste, analytics

**Performance**

  - Async import for code blocks and task items on renderer
    - https://product-fabric.atlassian.net/browse/ED-7155
  
**Table**
  - Add support to sort tables that contains smart links
    - https://product-fabric.atlassian.net/browse/ED-7449
  - Scale table when changing to full width mode
    - https://product-fabric.atlassian.net/browse/ED-7724

**Text color**
  - Update text color toolbar with right color when text is inside a list, panel, etc.
    - https://product-fabric.atlassian.net/browse/FM-1752


**Mobile**
  - Implement undo/redo interface on Hybrid Editor
    - https://product-fabric.atlassian.net/browse/FM-2393

**Copy and Paste**

  - Support copy & paste when missing context-id attr
    - https://product-fabric.atlassian.net/browse/MS-2344
  - Right click + copy image fails the second time that is pasted
    - https://product-fabric.atlassian.net/browse/MS-2324
  - Copying a never touched image for the first time from editor fails to paste
    - https://product-fabric.atlassian.net/browse/MS-2338
  - Implement analytics when a file is copied
    - https://product-fabric.atlassian.net/browse/MS-2036

**Media**

- Add analytics events and error reporting [NEW BIG FEATURE]
  - https://product-fabric.atlassian.net/browse/MS-2275
  - https://product-fabric.atlassian.net/browse/MS-2329
  - https://product-fabric.atlassian.net/browse/MS-2330
  - https://product-fabric.atlassian.net/browse/MS-2331
  - https://product-fabric.atlassian.net/browse/MS-2332
  - https://product-fabric.atlassian.net/browse/MS-2390
- Fixed issue where we can’t insert same file from MediaPicker twice
  - https://product-fabric.atlassian.net/browse/MS-2080
- Disable upload of external files to media
  - https://product-fabric.atlassian.net/browse/MS-2372
 

**Notable Bug Fixes**

  - Implement consistent behaviour for rule and mediaSingle on insertion
    - Feature Flag:
      - allowNewInsertionBehaviour - [default: true]
    - https://product-fabric.atlassian.net/browse/ED-7503
  - Fixed bug where we were showing table controls on mobile.
    - https://product-fabric.atlassian.net/browse/ED-7690
  - Fixed bug where editor crashes after unmounting react component.
    - https://product-fabric.atlassian.net/browse/ED-7318
  - Fixed bug where custom emojis are not been showed on the editor
    - https://product-fabric.atlassian.net/browse/ED-7726
  