---
display: "Exclude Directories"
oneline: "Remove a list of directories from the watch process."
---

You can use [`excludeFiles`](#excludeFiles) to drastically reduce the number of files which are watched during `--watch`. This can be a useful way to reduce the number of open file which TypeScript tracks on Linux.

```json tsconfig
{
  "watchOptions": {
    "excludeDirectories": ["**/node_modules", "_build", "temp/*"]
  }
}
```
