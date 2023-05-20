---
display: "Watch Options"
---

TypeScript 3.8 shipped a new strategy for watching directories, which is crucial for efficiently picking up changes to `node_modules`.

On operating systems like Linux, TypeScript installs directory watchers (as opposed to file watchers) on `node_modules` and many of its subdirectories to detect changes in dependencies.
This is because the number of available file watchers is often eclipsed by the number of files in `node_modules`, whereas there are way fewer directories to track.

Because every project might work better under different strategies, and this new approach might not work well for your workflows, TypeScript 3.8 introduces a new `watchOptions` field which allows users to tell the compiler/language service which watching strategies should be used to keep track of files and directories.
