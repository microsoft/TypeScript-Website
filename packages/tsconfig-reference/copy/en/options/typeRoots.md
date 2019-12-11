---
display: "Type Roots"
---

By default all *visible* "`@types`" packages are included in your compilation. 
Packages in `node_modules/@types` of any enclosing folder are considered *visible*.
For example, that means packages within `./node_modules/@types/`,  `../node_modules/@types/`, `../../node_modules/@types/`, and so on.

If `typeRoots` is specified, *only* packages under `typeRoots` will be included. For example:

```json
{
   "compilerOptions": {
       "typeRoots" : ["./typings", "./vendor/types"]
   }
}
```

This config file will include *all* packages under `./typings` and `./vendor/types`, and no packages from `./node_modules/@types`.
All paths are relative to the `tsconfig.json`.
