---
display: "moduleDetection"
oneline: "Control what method is used to detect the whether a JS file is a module."
---

There are three choices: 

- `"auto"` - TypeScript will not only look for import and export statements, but it will also check whether the `"type"` field in a `package.json` is set to `"module"` when running with [`module`](#module): `nodenext` or `node16`, and check whether the current file is a JSX file when running under [`jsx`](#jsx):  `react-jsx`.

-`"legacy"` - The same behavior as 4.6 and prior, usings import and export statements to determine whether a file is a module.

- `"force"` - Ensures that every non-declaration file is treated as a module.
