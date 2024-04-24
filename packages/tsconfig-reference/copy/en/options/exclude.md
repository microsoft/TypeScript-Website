---
display: "Exclude"
oneline: "Filters results from the [`include`](#include) option."
---

Specifies an array of filenames or patterns that should be skipped when resolving [`include`](#include).

**Important**: `exclude` _only_ changes which files are included as a result of the [`include`](#include) setting.
A file specified by `exclude` can still become part of your codebase due to an `import` statement in your code, a `types` inclusion, a `/// <reference` directive, or being specified in the [`files`](#files) list.

It is not a mechanism that **prevents** a file from being included in the codebase - it simply changes what the [`include`](#include) setting finds.
