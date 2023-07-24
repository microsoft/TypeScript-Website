---
display: "Exclude"
oneline: "Specify a list of modules which to exclude from type acquisition."
---

Offers a config for disabling the type-acquisition for a certain module in JavaScript projects. This can be useful for projects which include other libraries in testing infrastructure which aren't needed in the main application.

```json
{
  "typeAcquisition": {
    "exclude": ["jest", "mocha"]
  }
}
```
