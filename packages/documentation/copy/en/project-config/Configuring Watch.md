---
title: Configuring Watch
layout: docs
permalink: /docs/handbook/configuring-watch.html
oneline: How to configure the watch mode of TypeScript
translatable: true
---

As of TypeScript 3.8 and onward, the Typescript compiler exposes configuration which controls how it watches files and directories. Prior to this version, configuration required the use of environment variables which are still available.

## Background

The `--watch` implementation of the compiler relies on Node's `fs.watch` and `fs.watchFile`. Each of these methods has pros and cons.

`fs.watch` relies on file system events to broadcast changes in the watched files and directories. The implementation of this command is OS dependent and unreliable - on many operating systems, it does not work as expected. Additionally, some operating systems limit the number of watches which can exist simultaneously (e.g. some flavors of [Linux](https://man7.org/linux/man-pages/man7/inotify.7.html)). Heavy use of `fs.watch` in large codebases has the potential to exceed these limits and result in undesirable behavior. However, because this implementation relies on an events-based model, CPU use is comparatively light. The compiler typically uses `fs.watch` to watch directories (e.g. source directories included by compiler configuration files and directories in which module resolution failed, among others). TypeScript uses these to augment potential failures in individual file watchers. However, there is a key limitation of this strategy: recursive watching of directories is supported on Windows and macOS, but not on Linux. This suggested a need for additional strategies for file and directory watching.

`fs.watchFile` uses polling and thus costs CPU cycles. However, `fs.watchFile` is by far the most reliable mechanism available to subscribe to the events from files and directories of interest. Under this strategy, the TypeScript compiler typically uses `fs.watchFile` to watch source files, config files, and files which appear missing based on reference statements. This means that the degree to which CPU usage will be higher when using `fs.watchFile` depends directly on number of files watched in the codebase.

## Configuring file watching using a `tsconfig.json`

The suggested method of configuring watch behavior is through the new `watchOptions` section of `tsconfig.json`. We provide an example configuration below. See the following section for detailed descriptions of the settings available.

```json tsconfig
{
  // Some typical compiler options
  "compilerOptions": {
    "target": "es2020",
    "moduleResolution": "node"
    // ...
  },

  // NEW: Options for file/directory watching
  "watchOptions": {
    // Use native file system events for files and directories
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",

    // Poll files for updates more frequently
    // when they're updated a lot.
    "fallbackPolling": "dynamicPriority",

    // Don't coalesce watch notification
    "synchronousWatchDirectory": true,

    // Finally, two additional settings for reducing the amount of possible
    // files to track  work from these directories
    "excludeDirectories": ["**/node_modules", "_build"],
    "excludeFiles": ["build/fileWhichChangesOften.ts"]
  }
}
```

For further details, see [the release notes for Typescript 3.8](/docs/handbook/release-notes/typescript-3-8.html#better-directory-watching-on-linux-and-watchoptions).

## Configuring file watching using environment variable `TSC_WATCHFILE`

<!-- prettier-ignore -->
Option                                         | Description
-----------------------------------------------|----------------------------------------------------------------------
`PriorityPollingInterval`                      | Use `fs.watchFile`, but use different polling intervals for source files, config files and missing files
`DynamicPriorityPolling`                       | Use a dynamic queue where frequently modified files are polled at shorter intervals, and unchanged files are polled less frequently
`UseFsEvents`                                  | Use `fs.watch`. On operating systems that limit the number of active watches, fall back to `fs.watchFile` when a watcher fails to be created.
`UseFsEventsWithFallbackDynamicPolling`        | Use `fs.watch`. On operating systems that limit the number of active watches, fall back to dynamic polling queues (as explained in `DynamicPriorityPolling`)
`UseFsEventsOnParentDirectory`                 | Use `fs.watch` on the _parent_ directories of included files (yielding a compromise that results in lower CPU usage than pure `fs.watchFile` but potentially lower accuracy).
default (no value specified)                   | If environment variable `TSC_NONPOLLING_WATCHER` is set to true, use `UseFsEventsOnParentDirectory`. Otherwise, watch files using `fs.watchFile` with `250ms` as the timeout for any file.

## Configuring directory watching using environment variable `TSC_WATCHDIRECTORY`

For directory watches on platforms which don't natively allow recursive directory watching (i.e. non macOS and Windows operating systems) is supported through recursively creating directory watchers for each child directory using different options selected by `TSC_WATCHDIRECTORY`. 

**NOTE:** On platforms which support native recursive directory watching, the value of `TSC_WATCHDIRECTORY` is ignored.

<!-- prettier-ignore -->
Option                                         | Description
-----------------------------------------------|----------------------------------------------------------------------
`RecursiveDirectoryUsingFsWatchFile`           | Use `fs.watchFile` to watch included directories and child directories.
`RecursiveDirectoryUsingDynamicPriorityPolling`| Use a dynamic polling queue to poll changes to included directories and child directories.
default (no value specified)                   | Use `fs.watch` to watch included directories and child directories.
