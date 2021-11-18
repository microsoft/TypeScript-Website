---
display: "Skip Lib Check"
oneline: "Skip type checking all .d.ts files."
---

Skip type checking of declaration files.

This can save time during compilation at the expense of type-system accuracy. For example, two libraries could
define two copies of the same `type` in an inconsistent way. Rather than doing a full check of all `d.ts` files, TypeScript
will type check the code you specifically refer to in your app's source code.

A common case where you might think to use `skipLibCheck` is when there are two copies of a library's types in
your `node_modules`. In these cases, you should consider using a feature like [yarn's resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/)
to ensure there is only one copy of that dependency in your tree or investigate how to ensure there is
only one copy by understanding the dependency resolution to fix the issue without additional tooling.

Sometimes TypeScript releases in-range breaking changes, and although this can sometimes causes errors in downstream projects, the
changes help to progress TypeScript to a better state for everyone. When a breaking change hapepns, dependencies
in a project's `node_modules` may start to show type errors, andthe `skipLibCheck` option will
be useful for silencing these errors until an update can be performed to migrate a code base or its dependencies forward.
