---
display: "watchDirectory"
oneline: "Determine how directories are watched"
---

The strategy for how entire directory trees are watched under systems that lack recursive file-watching functionality.

- `fixedPollingInterval`: Check every directory for changes several times a second at a fixed interval.
- `dynamicPriorityPolling`: Use a dynamic queue where less-frequently modified directories will be checked less often.
- `useFsEvents` (the default): Attempt to use the operating system/file system's native events for directory changes.
