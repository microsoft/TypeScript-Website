//// { compiler: { ts: "3.7-Beta" }, order: 1 }

// New to 3.7 is a check inside if statements for 
// when you accidentally use a function instead
// of the return value of a function.

// This only applies when the function is known
// to exist making the if statement always be true

// Here is an example plugin interface, where there
// are optional and non-optional callbacks.

interface PluginSettings {
  pluginShouldLoad?: () => void
  pluginActivate: () => void
}

declare const plugin: PluginSettings

// Because pluginShouldLoad could not exist, then
// the check is legitimate

if (plugin.pluginShouldLoad) {
  plugin.pluginShouldLoad()
}

// In 3.6 and below, this was not an error

if (plugin.pluginActivate) {
  plugin.pluginActivate()  
}
