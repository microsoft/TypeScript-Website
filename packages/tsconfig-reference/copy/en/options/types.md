---
display: "Types"
---

By default all *visible* "`@types`" packages are included in your compilation. 
Packages in `node_modules/@types` of any enclosing folder are considered *visible*.
For example, that means packages within `./node_modules/@types/`,  `../node_modules/@types/`, `../../node_modules/@types/`, and so on.

If `types` is specified, only packages listed will be included. For instance:

```json
{
   "compilerOptions": {
       "types" : ["node", "lodash", "express"]
   }
}
```

This `tsconfig.json` file will *only* include  `./node_modules/@types/node`, `./node_modules/@types/lodash` and `./node_modules/@types/express`.
Other packages under `node_modules/@types/*` will not be included.
