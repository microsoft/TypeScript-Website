//// { "compiler": {  }, "order": 1 }

// New to 3.7 is a check inside if statements for
// when you accidentally use a function instead
// of the return value of a function.

// This only applies when the function is known
// to exist making the if statement always be true.

// Here is an example plugin interface, where there
// are optional and non-optional callbacks.

interface PluginSettings {
  pluginShouldLoad?: () => void;
  pluginIsActivated: () => void;
}

declare const plugin: PluginSettings;

// Because pluginShouldLoad could not exist, then
// the check is legitimate.

if (plugin.pluginShouldLoad) {
  // Do something when pluginShouldLoad exists.
}

// In 3.6 and below, this was not an error.

if (plugin.pluginIsActivated) {
  // Want to do something when the plugin is activated,
  // but instead of calling the method we used it as a
  // property.
}

// pluginIsActivated should always exist, but TypeScript
// still allows the check, because the method is called
// inside the if block.

if (plugin.pluginIsActivated) {
  plugin.pluginIsActivated();
}
