---
display: "Lib Replacement"
oneline: "Enable substitution of default `lib` files with custom ones."
---

TypeScript 4.5 introduced the possibility of substituting the default `lib` files with custom ones.
All built-in library files would first try to be resolved from packages named `@typescript/lib-*`.
For example, you could lock your `dom` libraries onto a specific version of [the `@types/web` package](https://www.npmjs.com/package/@types/web?activeTab=readme) with the following `package.json`:

```json
{
    "devDependencies": {
       "@typescript/lib-dom": "npm:@types/web@0.0.199"
     }
}
```

When installed, a package called `@typescript/lib-dom` should exist, and TypeScript would always look there when searching for `lib.dom.d.ts`.

The `--libReplacement` flag allows you to disable this behavior.
If you're not using any `@typescript/lib-*` packages, you can now disable those package lookups with `--libReplacement false`.
In the future, `--libReplacement false` may become the default, so if you currently rely on the behavior you should consider explicitly enabling it with `--libReplacement true`.