Added shouldOpenMediaViewer property to Renderer to override the default behaviour.

The new optional property will act according to the following:

- **undefined**: (default behaviour) Media Card will open media viewer on click only if it's not in a mobile app and "on card click" event handler is not provided
- **true**: Media Card will open media viewer regardless of the default conditions
- **false**: Media Card will **not** open viewer regardless of the default conditions
