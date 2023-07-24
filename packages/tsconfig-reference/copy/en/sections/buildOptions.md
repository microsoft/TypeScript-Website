## Build Options

Type Acquisition is only important for JavaScript projects. In TypeScript projects you need to include the types in your projects explicitly. However, for JavaScript projects, the TypeScript tooling will download types for your modules in the background and outside of your node_modules folder.

You may not want this, in which case you can turn off type acquisition by having this `jsconfig.json` in the root of your project:

```json
{
  "typeAcquisition": {
    "enable": false
  }
}
```

Common uses for this section of a `jsconfig.json` is to tell TypeScript to download additional definitions for your tooling experience:

```json
{
  "typeAcquisition": {
    "include": ["jquery"]
  }
}
```
