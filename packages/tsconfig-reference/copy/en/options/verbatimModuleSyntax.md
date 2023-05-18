---
display: "Verbatim Module Syntax"
oneline: "Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting."
---

By default, TypeScript does something called *import elision*.
Basically, if you write something like

```ts
import { Car } from "./car";

export function drive(car: Car) {
    // ...
}
```

TypeScript detects that you're only using an import for types and drops the import entirely.
Your output JavaScript might look something like this:

```js
export function drive(car) {
    // ...
}
```

Most of the time this is good, because if `Car` isn't a value that's exported from `./car`, we'll get a runtime error.

But it does add a layer of complexity for certain edge cases.
For example, notice there's no statement like `import "./car";` - the import was dropped entirely.
That actually makes a difference for modules that have side-effects or not.

TypeScript's emit strategy for JavaScript also has another few layers of complexity - import elision isn't always just driven by how an import is used - it often consults how a value is declared as well.
So it's not always clear whether code like the following

```ts
export { Car } from "./car";
```

should be preserved or dropped.
If `Car` is declared with something like a `class`, then it can be preserved in the resulting JavaScript file.
But if `Car` is only declared as a `type` alias or `interface`, then the JavaScript file shouldn't export `Car` at all.

While TypeScript might be able to make these emit decisions based on information from across files, not every compiler can.

The `type` modifier on imports and exports helps with these situations a bit.
We can make it explicit whether an import or export is only being used for type analysis, and can be dropped entirely in JavaScript files by using the `type` modifier.

```ts
// This statement can be dropped entirely in JS output
import type * as car from "./car";

// The named import/export 'Car' can be dropped in JS output
import { type Car } from "./car";
export { type Car } from "./car";
```

`type` modifiers are not quite useful on their own - by default, module elision will still drop imports, and nothing forces you to make the distinction between `type` and plain imports and exports.
So TypeScript has the flag `--importsNotUsedAsValues` to make sure you use the `type` modifier, `--preserveValueImports` to prevent *some* module elision behavior, and `--isolatedModules` to make sure that your TypeScript code works across different compilers.
Unfortunately, understanding the fine details of those 3 flags is hard, and there are still some edge cases with unexpected behavior.

TypeScript 5.0 introduces a new option called `--verbatimModuleSyntax` to simplify the situation.
The rules are much simpler - any imports or exports without a `type` modifier are left around.
Anything that uses the `type` modifier is dropped entirely.

```ts
// Erased away entirely.
import type { A } from "a";

// Rewritten to 'import { b } from "bcd";'
import { b, type c, type d } from "bcd";

// Rewritten to 'import {} from "xyz";'
import { type xyz } from "xyz";
```

With this new option, what you see is what you get.

That does have some implications when it comes to module interop though.
Under this flag, ECMAScript `import`s and `export`s won't be rewritten to `require` calls when your settings or file extension implied a different module system.
Instead, you'll get an error.
If you need to emit code that uses `require` and `module.exports`, you'll have to use TypeScript's module syntax that predates ES2015:

<table>
<thead>
    <tr>
        <th>Input TypeScript</th>
        <th>Output JavaScript</th>
    </tr>
</thead>

<tr>
<td>

```ts
import foo = require("foo");
```

</td>
<td>

```js
const foo = require("foo");
```

</td>
</tr>
<tr>
<td>

```ts
function foo() {}
function bar() {}
function baz() {}

export = {
    foo,
    bar,
    baz
};
```

</td>
<td>

```js
function foo() {}
function bar() {}
function baz() {}

module.exports = {
    foo,
    bar,
    baz
};
```

</td>
</tr>
</table>

While this is a limitation, it does help make some issues more obvious.
For example, it's very common to forget to set the [`type` field in `package.json`](https://nodejs.org/api/packages.html#type) under `--module node16`.
As a result, developers would start writing CommonJS modules instead of an ES modules without realizing it, giving surprising lookup rules and JavaScript output.
This new flag ensures that you're intentional about the file type you're using because the syntax is intentionally different.

Because `--verbatimModuleSyntax` provides a more consistent story than `--importsNotUsedAsValues` and `--preserveValueImports`, those two existing flags are being deprecated in its favor.

For more details, read up on [the original pull request](https://github.com/microsoft/TypeScript/pull/52203) and [its proposal issue](https://github.com/microsoft/TypeScript/issues/51479).
