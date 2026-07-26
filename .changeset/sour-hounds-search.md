---
"@typescript/vfs": patch
---

Stop retaining a second parsed SourceFile per file in the virtual environment

`createVirtualTypeScriptEnvironment`'s `createFile`/`updateFile` parsed a `SourceFile` and handed it to the virtual compiler host, which kept it in its `sourceFiles` map for the lifetime of the environment. The language service never reads that map — it parses and caches its own `SourceFile`s from `getScriptSnapshot` — so every file written through the environment was held in memory as two full ASTs, and the parse which produced the second one was thrown away.

The environment now writes file contents through a new `writeFileText`/`updateFileText` path which only stores text. In a 40-file benchmark this cut retained heap from 318MB to 209MB and removed 80 redundant parses.
