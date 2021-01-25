---
display: "No Resolve"
oneline: "Disallow `import`s, `require`s or `<reference>`s from expanding the number of files TypeScript should add to a project."
---

By default, TypeScript will examine the initial set of files for `import` and `<reference` directives and add these resolved files to your program.

If `noResolve` is set, this process doesn't happen.
However, `import` statements are still checked to see if they resolve to a valid module, so you'll need to make sure this is satisfied by some other means.
