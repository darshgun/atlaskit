---
'@atlaskit/motion': minor
---

`ExitingPersistence` now has an `appear` prop.
Previously entering motions would always appear when mounting - now you have to opt into the behaviour.

```diff
-<ExitingPersistence>
+<ExitingPersistence appear>
  ...
</ExitingPersistence>
```
