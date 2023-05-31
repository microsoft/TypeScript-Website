---
display: "Watch File"
oneline: "Specify how the TypeScript watch mode works."
---

The strategy for how individual files are watched.

- `fixedPollingInterval`: Check every file for changes several times a second at a fixed interval.
- `priorityPollingInterval`: Check every file for changes several times a second, but use heuristics to check certain types of files less frequently than others.
- `dynamicPriorityPolling`: Use a dynamic queue where less-frequently modified files will be checked less often.
- `useFsEvents` (the default): Attempt to use the operating system/file system's native events for file changes.
- `useFsEventsOnParentDirectory`: Attempt to use the operating system/file system's native events to listen for changes on a file's parent directory
