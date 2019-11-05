build: avoid duplicate uglification of output bundles

Replaces `UglifyjsWebpackPlugin` with webpack's default `TerserPlugin`.

While there are no API changes caused by us there are diffable changes 
in the resulting output bundles, which might cause issues for consumers.

Extensive testing is recommended.
