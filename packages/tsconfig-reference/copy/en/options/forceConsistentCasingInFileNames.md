---
display: "Force Consistent Casing In File Names"
oneline: "Ensure that casing is correct in imports."
---

TypeScript follows the case sensitivity rules of the file system it's running on.
This can be problematic if some developers are working in a case-sensitive file system and others aren't.
If a file attempts to import `fileManager.ts` by specifying `./FileManager.ts` the file will be found in a case-insensitive file system, but not on a case-sensitive file system.

When this option is set, TypeScript will issue an error if a program tries to include a file by a casing different from the casing on disk.
