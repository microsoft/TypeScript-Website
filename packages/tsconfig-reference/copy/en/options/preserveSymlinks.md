---
display: "Preserve Symlinks"
oneline: "Disable resolving symlinks to their realpath. This correlates to the same flag in node."
---

This is to reflect the same flag in Node.js; which does not resolve the real path of symlinks.

This flag also exhibits the opposite behavior to Webpack’s `resolve.symlinks` option (i.e. setting TypeScript’s `preserveSymlinks` to true parallels setting Webpack’s `resolve.symlinks` to false, and vice-versa).

With this enabled, references to modules and packages (e.g. `import`s and `/// <reference type="..." />` directives) are all resolved relative to the location of the symbolic link file, rather than relative to the path that the symbolic link resolves to.
