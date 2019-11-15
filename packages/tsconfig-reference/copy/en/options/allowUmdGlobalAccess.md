---
display: "Allow Umd Global Access"
introduced: "3.5"
---

When set to true, allowUmdGlobalAccess lets you access UMD exports as globals from inside module files. A module file is a file that has imports or exports. Without this flag, using an export from a UMD module requires an import declaration.

An example use case for this flag would be a web project where you know the a particular library (like jQuery or Lodash) will always be available at runtime, but you can’t access it with an import.
