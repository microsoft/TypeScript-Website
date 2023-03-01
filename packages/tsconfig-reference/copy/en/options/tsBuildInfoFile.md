---
display: "TS Build Info File"
oneline: "Specify the folder for .tsbuildinfo incremental compilation files."
---

This setting lets you specify a file for storing incremental compilation information as a part of composite projects which enables faster
building of larger TypeScript codebases. You can read more about composite projects [in the handbook](/docs/handbook/project-references.html).

This option offers a way to configure the place where TypeScript keeps track of the files it stores on the disk to
indicate a project's build state.

The default depends on a combination of other settings

 - If `outFile` the file is `<outFile>.tsbuildinfo`

 - If `rootDir` and `outDir` then the file is `<outDir>/<relative path to config from rootDir>/<config name>.tsbuildinfo`
   For example if `rootDir` is `src` and `outDir` is `dest` and  the config is
   `./tsconfig.json` then tsBuildInfoFile defaults to `./tsconfig.tsbuildinfo`
   because the relative path from `src/` to `./tsconfig.json` is `../`.

 - If just `outDir` then `<outDir>/<config name>.tsbuildInfo`

 - otherwise `<config name>/.tsbuildInfo`
