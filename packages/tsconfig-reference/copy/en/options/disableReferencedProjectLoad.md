---
display: "disableReferencedProjectLoad"
oneline: "Reduces the number of projects loaded automatically by TypeScript"
---

In large multi-project TypeScript programs, you may want to reduce the number of projects loaded automatically by the TypeScript watcher to increase editor responsiveness.

Enabling this flag will stop child projects from automatically being loaded when a parent has become active.
