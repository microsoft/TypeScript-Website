## Imports node's type defs

This has a global `process` and two imports

```ts twoslash
/// <reference types="node" />

// @ts-check
import fs from "fs"
import { execSync } from "child_process"

const fileToEdit = process.env.HUSKY_GIT_PARAMS!.split(" ")[0]
const files = execSync("git status --porcelain", { encoding: "utf8" })

const maps: any = {
  "spelltower/": "SPTWR",
  "typeshift/": "TPSFT",
}

const prefixes = new Set()
files.split("\n").forEach(f => {
  const found = Object.keys(maps).find(prefix => f.includes(prefix))
  if (found) prefixes.add(maps[found])
})

if (prefixes.size) {
  const prefix = [...prefixes.values()].sort().join(", ")
  const msg = fs.readFileSync(fileToEdit, "utf8")
  if (!msg.includes(prefix)) {
    fs.writeFileSync(fileToEdit, `[${prefix}] ${msg}`)
  }
}
```
