---
header: Intro to the TSConfig Reference
firstLine: A TSConfig file in a directory indicates that the directory is the root of a TypeScript or JavaScript project...
---

A TSConfig file in a directory indicates that the directory is the root of a TypeScript or JavaScript project.
The TSConfig file can be either a `tsconfig.json` or `jsconfig.json`, both have the same set of config variables.

This page covers all of the different options available inside a TSConfig file. There are over 100 options, and this page is not built to be read from top to bottom. Instead it has five main sections:

- A categorized overview of all compiler flags
- The [root fields](#Project_Files_0) for letting TypeScript know what files are available
- The [`compilerOptions`](#compilerOptions) fields, this is the majority of the document
- The [`watchOptions`](#watchOptions) fields, for tweaking the watch mode
- The [`typeAcquisition`](#typeAcquisition) fields, for tweaking the how types are added to JavaScript projects

If you are starting a TSConfig from scratch, you may want to consider using `tsc --init` to bootstrap or use a [TSConfig base](https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases).
