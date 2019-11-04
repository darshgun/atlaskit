FM-2211 Implement scrolling improvements to prevent user typing behind keyboard on iOS

New editor plugin IOSScroll is added into the plugins list for users on iOS mobile devices
This works with a new native-to-web bridge method `setKeyboardControlsHeight` to add an extra buffer to the bottom of the page when the on-screen keyboard is showing
