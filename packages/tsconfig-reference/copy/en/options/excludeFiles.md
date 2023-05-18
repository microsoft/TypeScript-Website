---
display: "Exclude Files"
oneline: "Remove a list of files from the watch mode's processing."
---

You can use `excludeFiles` to remove a set of specific files from the files which are watched.

```json tsconfig
{
  "watchOptions": {
    "excludeFiles": ["temp/file.ts"]
  }
}
```
