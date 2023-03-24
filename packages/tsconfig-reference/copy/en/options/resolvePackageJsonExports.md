---
display: "Resolve package.json Exports"
oneline: "Use the package.json 'exports' field when resolving package imports."
---

`--resolvePackageJsonExports` forces TypeScript to consult [the `exports` field of `package.json` files](https://nodejs.org/api/packages.html#exports) if it ever reads from a package in `node_modules`.

This option defaults to `true` under the `node16`, `nodenext`, and `bundler` options for `--moduleResolution`.