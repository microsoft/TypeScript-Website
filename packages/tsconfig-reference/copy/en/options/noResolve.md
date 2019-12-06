---
display: "No Resolve"
---

By default, TypeScript will examine the initial set of files for `import` and `<reference` directives and add these resolved files to your program.

If `noResolve` isn't set, this process doesn't happen.
However, `import` statements are still checked to see if they resolve to a valid module, so you'll need to make sure this is satisfied by some other means.
