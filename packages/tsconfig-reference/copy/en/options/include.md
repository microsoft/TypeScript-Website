---
display: "Include"
---

**Default**: `[]` if `files` is specified, otherwise `["**/*"]`


```json
{
   "include": ["src/**", "tests/**"]
}
```

Specifies an array of filenames or patterns to include in the program.
These filenames are resolved relative to the directory containing the `tsconfig.json` file.

`include` and `exclude` support wildcard characters to make glob patterns:
 * `*` matches zero or more characters (excluding directory separators)
 * `?` matches any one character (excluding directory separators)
 * `**/` recursively matches any subdirectory

If a glob pattern doesn't include a file extension, then only files with supported extensions are included (e.g. `.ts`, `.tsx`, and `.d.ts` by default, with `.js` and `.jsx` if `allowJs` is set to true).
