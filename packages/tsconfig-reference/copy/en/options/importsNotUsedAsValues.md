---
display: "Imports Not Used As Values"
oneline: "Specify emit/checking behavior for imports that are only used for types."
---

Deprecated in favor of [`verbatimModuleSyntax`](#verbatimModuleSyntax).

This flag controls how `import` works, there are 3 different options:

- `remove`: The default behavior of dropping `import` statements which only reference types.

- `preserve`: Preserves all `import` statements whose values or types are never used. This can cause imports/side-effects to be preserved.

- `error`: This preserves all imports (the same as the preserve option), but will error when a value import is only used as a type. This might be useful if you want to ensure no values are being accidentally imported, but still make side-effect imports explicit.

This flag works because you can use `import type` to explicitly create an `import` statement which should never be emitted into JavaScript.
