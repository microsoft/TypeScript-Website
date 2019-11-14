---
display: "Allow Umd Global Access"
introduced: "3.5"
---

When set to true, `allowUmdGlobalAccess` let's you access UMD globals from inside module files. A module file is a 
file which has import/exports, this flag brings their behavior inline with a script file where a declare can affect 
many files.

An example use case for this flag is be where you are writing a web project and you know the runtime will always have
a particular library (like jQuery or Lodash) and you can't access the library via an import/export.
