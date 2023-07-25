---
display: "Preserve Value Imports"
oneline: "Preserve unused imported values in the JavaScript output that would otherwise be removed."
---

Deprecated in favor of [`verbatimModuleSyntax`](#verbatimModuleSyntax).

There are some cases where TypeScript can't detect that you're using an import. For example, take the following code:

```ts
import { Animal } from "./animal.js";

eval("console.log(new Animal().isDangerous())");
```

or code using 'Compiles to HTML' languages like Svelte or Vue. `preserveValueImports` will prevent TypeScript from removing the import, even if it appears unused.

When combined with [`isolatedModules`](#isolatedModules): imported types _must_ be marked as type-only because compilers that process single files at a time have no way of knowing whether imports are values that appear unused, or a type that must be removed in order to avoid a runtime crash.
