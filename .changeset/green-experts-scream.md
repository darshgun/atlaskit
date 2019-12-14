---
'@atlaskit/conversation': patch
---

Fixes a bug where the beforeunload alert was showing when editor content was empty, a user had cancelled, or a user had saved a comment. It should only be shown if a user has unsaved content in the editor.
