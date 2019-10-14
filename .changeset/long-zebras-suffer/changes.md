## What changed and why was this change made?
Lazy load react-select and react-beautiful-dnd to bring down the bundle size. This reduces the main navigation-next bundle bby 33%.

## How to consume the breaking change?
Although this is a major version, there's no API change or any other noticable change in the behaviour. It should *just work*™️like before. But do a through round of testing to make sure nothing breaks unexpectedly. Areas to stress would be parts of navigation that use the Switcher component and any of the draggable components