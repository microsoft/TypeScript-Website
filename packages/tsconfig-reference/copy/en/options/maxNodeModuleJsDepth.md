---
display: "Max Node Module JS Depth"
oneline: "Specify the maximum folder depth used for checking JavaScript files from `node_modules`. Only applicable with [`allowJs`](#allowJs)."
---

The maximum dependency depth to search under `node_modules` and load JavaScript files.

This flag can only be used when [`allowJs`](#allowJs) is enabled, and is used if you want to have TypeScript infer types for all of the JavaScript inside your `node_modules`.

Ideally this should stay at 0 (the default), and `d.ts` files should be used to explicitly define the shape of modules.
However, there are cases where you may want to turn this on at the expense of speed and potential accuracy.
