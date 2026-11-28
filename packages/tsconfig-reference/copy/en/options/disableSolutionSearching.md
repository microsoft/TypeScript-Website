---
display: "Disable Solution Searching"
oneline: "Opt a project out of multi-project reference checking when editing."
---

When working with [composite TypeScript projects](/docs/handbook/project-references.html), this option provides a way to tell editors not to probe in parent directories for an owning "workspace-style" or "solution-style" `tsconfig.json`.

TypeScript's language service will typically search for workspace-style configuarations when using features like _Find all References_.

This flag is something you can use to increase responsiveness in large composite projects.
