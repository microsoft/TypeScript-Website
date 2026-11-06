---
display: "Disable Referenced Project Load"
oneline: "Avoid searching for symbols across referenced projects in code editors."
---

In multi-project TypeScript programs, TypeScript will load all referenced projects into memory in order to provide accurate results for editor responses which require a full knowledge graph like *Find all References* and *Rename*.

If your project is large, you can use the flag `disableReferencedProjectLoad` to avoid loading referenced projects to answer these questions.
Instead, referenced projects will only be searched if files of the referenced projects are already open in the editor.

