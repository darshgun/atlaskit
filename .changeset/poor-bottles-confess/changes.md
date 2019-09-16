FM-2393 Expose undo/redo methods on mobile bridge

native-to-web: undo/redo methods which will hook directly into prosemirror-history's
web-to-native: undoRedoBridge.stateChange which informs native whether undo and redo are currently available so they can enable/disable their buttons accordingly
