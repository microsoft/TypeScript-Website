---
display: "Type Acquisition"
oneline: "Specify options for automatic acquisition of declaration files."
---

When you have a JavaScript project in your editor, TypeScript will provide types for your `node_modules` automatically using the DefinitelyTyped set of `@types` definitions.
This is called automatic type acquisition, and you can customize it using the `typeAcquisition` object in your configuration.

If you would like to disable or customize this feature, create a `jsconfig.json` in the root of your project:

```json
{
  "typeAcquisition": {
    "enable": false
  }
}
```

If you have a specific module which should be included (but isn't in `node_modules`):

```json
{
  "typeAcquisition": {
    "include": ["jest"]
  }
}
```

If a module should not be automatically acquired, for example if the library is available in your `node_modules` but your team has agreed to not use it:

```json
{
  "typeAcquisition": {
    "exclude": ["jquery"]
  }
}
```
