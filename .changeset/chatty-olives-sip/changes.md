Removed deprecated props from editor core

Following props have been removed from `@atlaskit/editor-core`:

- mediaProvider –> Use `media={{ provider }}` instead
- cardProvider -> Use `UNSAFE_cards={{ provider }}` instead
- allowPlaceholderCursor -> Enabled by default
- addonToolbarComponents -> Not supported anymore (and according to sourcegraph not used anywhere)
- allowCodeBlocks -> Enabled by default
- allowLists -> Enabled by default
- allowHelpDialog -> Is enabled by default, pass `false` to disabled it
