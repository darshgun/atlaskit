ED-5137 added heading anchor link

You can now use the `allowHeadingAnchorLinks` prop to display heading anchor links in renderer, next to all top level headings.
There is also an existing property called `disableHeadingIDs`, when you set both `disableHeadingIDs` and `allowHeadingAnchorLinks` to false, the anchor link button will not display, however the heading anchor id will still be in the DOM.

Note: This feature is only enabled for top level headings(e.g. not nested in other blocks like table).
