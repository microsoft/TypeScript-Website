---
display: "Fallback Polling"
oneline: "Specify what approach the watcher should use if the system runs out of native file watchers."
---

When using file system events, this option specifies the polling strategy that gets used when the system runs out of native file watchers and/or doesn't support native file watchers.

- `fixedPollingInterval`: Check every file for changes several times a second at a fixed interval.
- `priorityPollingInterval`: Check every file for changes several times a second, but use heuristics to check certain types of files less frequently than others.
- `dynamicPriorityPolling`: Use a dynamic queue where less-frequently modified files will be checked less often.
- `synchronousWatchDirectory`: Disable deferred watching on directories. Deferred watching is useful when lots of file changes might occur at once (e.g. a change in `node_modules` from running `npm install`), but you might want to disable it with this flag for some less-common setups.
