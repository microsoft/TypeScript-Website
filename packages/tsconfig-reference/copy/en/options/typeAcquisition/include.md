---
display: "Include"
oneline: "Specify a list of modules which to acquire types for."
---

If you have a JavaScript project where TypeScript needs additional guidance to understand global dependencies, or have disabled the built-in inference via [`disableFilenameBasedTypeAcquisition`](#disableFilenameBasedTypeAcquisition).

You can use `include` to specify which types should be used from DefinitelyTyped:

```json
{
  "typeAcquisition": {
    "include": ["jquery"]
  }
}
```
