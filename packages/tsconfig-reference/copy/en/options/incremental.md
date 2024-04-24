---
display: "Incremental"
oneline: "Save .tsbuildinfo files to allow for incremental compilation of projects."
---

Tells TypeScript to save information about the project graph from the last compilation to files stored on disk. This
creates a series of `.tsbuildinfo` files in the same folder as your compilation output. They are not used by your
JavaScript at runtime and can be safely deleted. You can read more about the flag in the [3.4 release notes](/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag).

To control which folders you want to the files to be built to, use the config option [`tsBuildInfoFile`](#tsBuildInfoFile).
