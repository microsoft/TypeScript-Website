---
display: "enable"
oneline: "Disable the type acquisition for JavaScript projects."
---

Offers a config for disabling type-acquisition in JavaScript projects:

```ts
{
  "typeAcquisition": {
    "enable": false
  }
}
```

This could potentially remove all of the editor auto-completion for your project, if you want to get them back, you can use the [Type Search](https://www.typescriptlang.org/dt/search) to find `@types` packages or packages with types in them.
