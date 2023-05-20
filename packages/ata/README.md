# TypeScript - Automatic Type Acquisition

A dependency for downloading `*.d.ts` files corresponding to a Node.js source file. Relies on API's provided by [jsdelivr](https://www.jsdelivr.com).

### Usage

```ts
// Create the function for running ATA with a series of callbacks
const ata = setupTypeAcquisition({
  projectName: "My ATA Project",
  typescript: ts,
  logger: console,
  delegate: {
    receivedFile: (code: string, path: string) => {
      // Add code to your runtime at the path...
    },
    started: () => {
      console.log("ATA start")
    },
    progress: (downloaded: number, total: number) => {
      console.log(`Got ${downloaded} out of ${total}`)
    },
    finished: vfs => {
      console.log("ATA done", vfs)
    },
  },
})

// Run that function with the new sourcefile
ata(`import danger from "danger"`)
```

You can call `ata` when it is convenient to you, it will not grab the same dependencies twice. The callbacks for `started` and `finished` are only triggered when some work is going to happen, so you can use those for UI elements show/hide. `progress` is triggered every 5 downloads.

### How it works

At a high level, for this input code:

```
import danger from "danger"
```

The library will

- Look for the latest npm module of "danger", then get its file list
- As there are `.d.ts` files to download in the dep, then it triggers `started`
- Download the `*.d.ts` files for "danger" from the npm module "danger"
- Read those `.d.ts` and look at these modules from usage:
  - `"node-fetch"` - it sees that "node-fetch" has no `.d.ts` files and gets them from "@types/node-fetch"
  - `"commander"` - it sees that command ships its own types
  - `"@octokit/rest"` - it sees that octokit/rest ships its own types
  - `"gitlab"` - it also sees
- Recurse though their dependencies too.
- Once those are done, trigger `finished` with a Map of the `vfs` if you prefer to set them in bulk.

### Niceties

Users can give a specific npm version or tag to work from instead of the default "latest":

```ts
import { xy } from "xyz" // types: beta
```

If this isn't something you want, I'm not against a flag to disable it.
