---
'@atlaskit/editor-core': minor
---

FM-2694 Scroll user's selection (cursor) into view whenever they insert/delete nodes, format text, undo/redo or paste content

Add new editor plugin: `ScrollIntoView`
This hooks into each transaction applied and calls ProseMirror's [scrollIntoView](https://prosemirror.net/docs/ref/#state.Transaction.scrollIntoView) if the transaction is a primary action from the user that updates the document
This behaviour is on by default and should be opted out of on a per-transaction basis, initially we have opted out of any interactions with the floating toolbar or breakout buttons and resizing, as to perform these actions you are in the context of what you are editing already
