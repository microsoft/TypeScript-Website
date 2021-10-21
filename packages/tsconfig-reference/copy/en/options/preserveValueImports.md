---
display: "preserveValueImports"
oneline: "Preserve unused imported values in the JavaScript output that would otherwise be removed."
---

There are some cases where TypeScript can't detect that you're using an import. For example, take the following code:

```ts
import { Animal } from "./animal.js";

eval("console.log(new Animal().isDangerous())");
```

or code using 'Compiles to HTML' languages like Svelte or Vue.

When combined with [`isolatedModules`](#isolatedModules): imported types _must_ be marked as type-only because compilers that process single files at a time have no way of knowing whether imports are values that appear unused, or a type that must be removed in order to avoid a runtime crash.

For example, in the following code `TitleComponent` is a function and `TitleComponentProps` is a type with `isolatedModules` and `preserveValueImports` are enabled:

```ts twoslash
// @errors: 1444
// @preserveValueImports: true
// @isolatedModules: true
// @module: es2015

// @filename: TitleComponent.ts
export function TitleComponent() {}
export interface TitleComponentProps {}
// @filename: index.ts
// ---cut---
import { TitleComponent, TitleComponentProps } from "./TitleComponent.js";
```

Which can be fixed by prefixing `TitleComponentProps` with `type` to mark it as a type-only import:

```ts twoslash
// @preserveValueImports: true
// @isolatedModules: true
// @module: es2015

// @filename: TitleComponent.ts
export function TitleComponent() {}
export interface TitleComponentProps {}
// @filename: index.ts
// ---cut---
import { TitleComponent, type TitleComponentProps } from "./TitleComponent.js";
```
